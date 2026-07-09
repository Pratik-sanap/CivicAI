from __future__ import annotations

from fastapi import Request

from app.services.image_analysis_service import ImageAnalysisService
from app.services.report_service import ReportService


def get_report_service(request: Request) -> ReportService:
    return request.app.state.report_service


def get_image_analysis_service(request: Request) -> ImageAnalysisService:
    return request.app.state.image_analysis_service
