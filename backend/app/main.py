from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import get_settings
from app.repositories.report_repository import InMemoryReportRepository
from app.services.image_analysis_service import ImageAnalysisService
from app.services.issue_analyzer import IssueAnalyzer
from app.services.report_service import ReportService


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.project_name,
        version="1.0.0",
        description="AI-powered civic issue reporting API for CivicAI.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.frontend_origins),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    repository = InMemoryReportRepository()
    analyzer = IssueAnalyzer(api_key=settings.gemini_api_key, model=settings.gemini_model)
    app.state.image_analysis_service = ImageAnalysisService(analyzer=analyzer)
    app.state.report_service = ReportService(repository=repository, analyzer=analyzer)

    app.include_router(api_router, prefix=settings.api_v1_prefix)

    @app.get("/")
    async def root() -> dict[str, str]:
        return {
            "service": settings.project_name,
            "version": app.version,
            "docs": "/docs",
            "health": f"{settings.api_v1_prefix}/health",
        }

    return app


app = create_app()
