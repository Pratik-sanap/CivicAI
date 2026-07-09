from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.v1.dependencies import get_report_service
from app.schemas.dashboard import DashboardResponse
from app.services.report_service import ReportService

router = APIRouter(tags=["Dashboard"])


@router.get(
    "/dashboard",
    response_model=DashboardResponse,
    summary="GET /dashboard — Aggregate statistics for the admin dashboard",
    description=(
        "Returns total complaints, open count, resolved-this-week, average resolution "
        "time, status/severity breakdowns, top categories, top departments, and a "
        "7-day daily trend — all computed from the live complaint store."
    ),
)
def get_dashboard(
    service: ReportService = Depends(get_report_service),
) -> DashboardResponse:
    """Return aggregated complaint statistics for the municipal admin dashboard."""
    return service.get_dashboard()
