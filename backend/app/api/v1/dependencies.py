"""FastAPI dependency providers for service injection."""

from __future__ import annotations

from fastapi import HTTPException, Request, status

from app.services.gemini_service import GeminiService
from app.services.image_analysis_service import ImageAnalysisService
from app.services.report_service import ReportService
from app.services.storage_service import StorageService


def get_report_service(request: Request) -> ReportService:
    return request.app.state.report_service


def get_image_analysis_service(request: Request) -> ImageAnalysisService:
    return request.app.state.image_analysis_service


def get_gemini_service(request: Request) -> GeminiService:
    service = request.app.state.gemini_service
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "AI analysis is unavailable. "
                "GEMINI_API_KEY is not configured on the server."
            ),
        )
    return service


def get_storage_service(request: Request) -> StorageService:
    service = request.app.state.storage_service
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Image storage is unavailable. "
                "Supabase credentials are not configured on the server."
            ),
        )
    return service
