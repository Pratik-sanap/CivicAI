from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.endpoints.analyze import router as analyze_router
from app.api.v1.endpoints.analysis import router as analysis_router
from app.api.v1.endpoints.complaints import router as complaints_router
from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.api.v1.endpoints.heatmap import router as heatmap_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.reports import router as reports_router

api_router = APIRouter()

# ── Core endpoints ─────────────────────────────────────────────────────────────
api_router.include_router(health_router)

# ── AI analysis ────────────────────────────────────────────────────────────────
# POST /analyze        — new canonical path (multipart image → Gemini)
# POST /analysis/image — legacy path kept for backward compatibility
api_router.include_router(analyze_router)
api_router.include_router(analysis_router)

# ── Complaints CRUD ────────────────────────────────────────────────────────────
# POST   /complaints
# GET    /complaints
# GET    /complaints/{id}
# PATCH  /complaints/{id}
api_router.include_router(complaints_router)

# ── Aggregate / map endpoints ──────────────────────────────────────────────────
# GET /dashboard
# GET /heatmap
api_router.include_router(dashboard_router)
api_router.include_router(heatmap_router)

# ── Legacy reports router (kept for backward compat) ──────────────────────────
# POST   /reports
# GET    /reports
# GET    /reports/{id}
# PATCH  /reports/{id}/status
api_router.include_router(reports_router)
