"""POST /analyze endpoint — Full Milestone 1 pipeline.

Flow: Validate image → Upload to Supabase → Gemini analysis → Return structured response.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.api.v1.dependencies import get_gemini_service, get_storage_service
from app.schemas.analysis import ImageAnalysisResponse
from app.services.gemini_service import (
    GeminiConfigError,
    GeminiResponseError,
    GeminiService,
    GeminiTimeoutError,
)
from app.services.storage_service import StorageService, StorageServiceError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analyze", tags=["Analyze"])

_ALLOWED_MIME_PREFIXES = ("image/jpeg", "image/png", "image/webp", "image/gif")
_MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post(
    "",
    response_model=ImageAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze a civic issue image with Gemini Vision AI",
    description=(
        "Upload a photo of a civic problem. The image is stored in Supabase Storage "
        "and analyzed by Gemini Vision AI, which returns the detected issue category, "
        "severity, responsible department, priority, reasoning, estimated impact, "
        "resolution time, and a professionally drafted complaint."
    ),
)
async def analyze_image(
    image: UploadFile = File(
        ...,
        description="Image file of the civic issue (JPEG, PNG, WEBP, GIF). Max 10 MB.",
    ),
    latitude: float | None = Form(
        default=None,
        description="Optional GPS latitude of the issue location.",
    ),
    longitude: float | None = Form(
        default=None,
        description="Optional GPS longitude of the issue location.",
    ),
    gemini: GeminiService = Depends(get_gemini_service),
    storage: StorageService = Depends(get_storage_service),
) -> ImageAnalysisResponse:
    """Analyze an uploaded image and return AI-generated civic issue analysis."""

    # ── Step 1: Validate the uploaded image ────────────────────────────────────
    content_type = (image.content_type or "").lower()
    if not any(content_type.startswith(p) for p in _ALLOWED_MIME_PREFIXES):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"Unsupported media type '{content_type}'. "
                "Accepted formats: JPEG, PNG, WEBP, GIF."
            ),
        )

    image_bytes = await image.read()

    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Uploaded image file is empty.",
        )

    if len(image_bytes) > _MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image exceeds maximum allowed size of {_MAX_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    # ── Step 2: Upload image to Supabase Storage ──────────────────────────────
    try:
        public_image_url = await storage.upload_image(
            image_bytes=image_bytes,
            mime_type=content_type,
            original_filename=image.filename,
        )
    except StorageServiceError as exc:
        logger.error("Supabase upload failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Image storage failed: {exc}",
        )

    # ── Step 3: Analyze image with Gemini Vision ──────────────────────────────
    try:
        gemini_result = await gemini.analyze_image(
            image_bytes=image_bytes,
            mime_type=content_type,
        )
    except GeminiConfigError as exc:
        logger.error("Gemini configuration error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        )
    except GeminiTimeoutError as exc:
        logger.error("Gemini timeout: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=str(exc),
        )
    except GeminiResponseError as exc:
        logger.error("Gemini response error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )

    # ── Step 4: Compose the final response ────────────────────────────────────
    return ImageAnalysisResponse(
        category=gemini_result.category,
        severity=gemini_result.severity,
        confidence=gemini_result.confidence,
        department=gemini_result.department,
        priority=gemini_result.priority,
        reasoning=gemini_result.reasoning,
        estimated_impact=gemini_result.estimated_impact,
        estimated_resolution_time=gemini_result.estimated_resolution_time,
        professional_complaint=gemini_result.professional_complaint,
        image_url=public_image_url,
    )
