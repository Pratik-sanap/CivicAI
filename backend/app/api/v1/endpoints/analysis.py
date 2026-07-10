"""
Legacy POST /analysis/image endpoint — kept for backward compatibility.

This endpoint wraps the older IssueAnalyzer (keyword-rule + direct Gemini REST)
and does NOT upload the image to Supabase Storage.

New integrations should use POST /analyze which:
  • Uploads the image to Supabase Storage and returns a public URL
  • Uses the google-genai SDK (GeminiService) for richer structured output
  • Returns priority, reasoning, estimated_impact, and estimated_resolution_time
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.api.v1.dependencies import get_image_analysis_service
from app.schemas.analysis import ImageAnalysisResponse
from app.services.image_analysis_service import ImageAnalysisRequest, ImageAnalysisService

# Prefer POST /analyze for all new integrations
router = APIRouter(prefix="/analysis", tags=["Image Analysis"])


@router.post("/image", response_model=ImageAnalysisResponse)
async def analyze_image(
    image: UploadFile = File(...),
    notes: str | None = Form(default=None),
    service: ImageAnalysisService = Depends(get_image_analysis_service),
) -> ImageAnalysisResponse:
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please upload a valid image file.")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded image is empty.")

    request = ImageAnalysisRequest(image_bytes=image_bytes, mime_type=image.content_type, notes=notes)
    return await service.analyze_image(request)
