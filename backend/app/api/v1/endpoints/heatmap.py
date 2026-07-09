from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.api.v1.dependencies import get_report_service
from app.schemas.dashboard import HeatmapResponse
from app.services.report_service import ReportService

router = APIRouter(tags=["Heatmap"])


@router.get(
    "/heatmap",
    response_model=HeatmapResponse,
    summary="GET /heatmap — Geo-located complaint points for map rendering",
    description=(
        "Returns all complaints that have latitude/longitude coordinates as "
        "lightweight heatmap points. Each point includes severity weight (1–5), "
        "category, department, status, and a one-line summary for InfoWindows. "
        "Points without location data are excluded."
    ),
)
def get_heatmap(
    service: ReportService = Depends(get_report_service),
) -> HeatmapResponse:
    """Return geo-located complaint points suitable for Google Maps heatmap and marker layers."""
    return service.get_heatmap()
