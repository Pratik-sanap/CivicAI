"""
CivicAI FastAPI application factory.

This module wires together all services and mounts the versioned API router.
Two parallel service pipelines are initialised on startup:

  Legacy pipeline (backward-compatible endpoints):
    IssueAnalyzer   — keyword-rule fallback + direct Gemini REST calls
    ImageAnalysisService — wraps IssueAnalyzer for /analysis/image
    ReportService        — business logic over InMemoryReportRepository

  Primary pipeline (POST /analyze → Supabase Storage + Gemini SDK):
    GeminiService   — google-genai SDK client for Vision analysis
    StorageService  — Supabase Storage for image persistence

If GEMINI_API_KEY or Supabase credentials are absent at startup, the
corresponding service is set to None and the endpoint returns HTTP 503/502
with a clear error message rather than crashing the server.
"""
from __future__ import annotations

import logging

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import get_settings
from app.repositories.report_repository import InMemoryReportRepository
from app.services.gemini_service import GeminiConfigError, GeminiService
from app.services.image_analysis_service import ImageAnalysisService
from app.services.issue_analyzer import IssueAnalyzer
from app.services.report_service import ReportService
from app.services.storage_service import StorageConfigError, StorageService

load_dotenv()

logger = logging.getLogger(__name__)


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

    # ── Legacy services (kept for backward-compatible endpoints) ───────────────
    repository = InMemoryReportRepository()
    analyzer = IssueAnalyzer(api_key=settings.gemini_api_key, model=settings.gemini_model)
    app.state.image_analysis_service = ImageAnalysisService(analyzer=analyzer)
    app.state.report_service = ReportService(repository=repository, analyzer=analyzer)

    # ── Milestone 1: New dedicated services ───────────────────────────────────
    # GeminiService — dedicated Gemini Vision AI communication
    try:
        app.state.gemini_service = GeminiService(
            api_key=settings.gemini_api_key or "",
            model=settings.gemini_model,
        )
    except GeminiConfigError:
        logger.warning(
            "GEMINI_API_KEY is not set. POST /analyze will return 503. "
            "Set it in your .env file."
        )
        app.state.gemini_service = None

    # StorageService — Supabase Storage for image uploads
    try:
        app.state.storage_service = StorageService(
            supabase_url=settings.supabase_url or "",
            supabase_service_role_key=settings.supabase_service_role_key or "",
            bucket_name=settings.supabase_bucket,
        )
    except StorageConfigError:
        logger.warning(
            "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set. "
            "POST /analyze will return 502. Set them in your .env file."
        )
        app.state.storage_service = None

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
