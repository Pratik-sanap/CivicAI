from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.api.v1.dependencies import get_image_analysis_service
from app.schemas.analysis import ImageAnalysisResponse
from app.services.image_analysis_service import ImageAnalysisRequest, ImageAnalysisService

router = APIRouter(prefix="/analyze", tags=["Analyze"])

_ALLOWED_MIME_PREFIXES = ("image/jpeg", "image/png", "image/webp", "image/gif")
_MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post(
    "",
    response_model=ImageAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="POST /analyze — Analyze a civic issue image with Gemini Vision",
    description=(
        "Upload a photo of a civic problem. The image is sent to Gemini Vision, "
        "which returns the detected issue category, severity, responsible department, "
        "a formatted complaint text, and a confidence score."
    ),
)
async def analyze_image(
    image: UploadFile = File(
        ...,
        description="Image file of the civic issue (JPEG, PNG, WEBP, GIF). Max 10 MB.",
    ),
    notes: str | None = Form(
        default=None,
        max_length=1000,
        description="Optional citizen notes to accompany the image.",
    ),
    service: ImageAnalysisService = Depends(get_image_analysis_service),
) -> ImageAnalysisResponse:
    """Analyze an uploaded image and return AI-generated civic issue details."""

    # ── Validation ─────────────────────────────────────────────────────────────
    content_type = (image.content_type or "").lower()
    if not any(content_type.startswith(p) for p in _ALLOWED_MIME_PREFIXES):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"Unsupported media type '{content_type}'. "
                "Accepted: image/jpeg, image/png, image/webp, image/gif."
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

    # ── Delegate to service ────────────────────────────────────────────────────
    request = ImageAnalysisRequest(
        image_bytes=image_bytes,
        mime_type=content_type or "image/jpeg",
        notes=notes,
    )
    return await service.analyze_image(request)
