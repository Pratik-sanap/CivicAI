from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.schemas.report import (
    IssueCategory,
    Location,
    MunicipalDepartment,
    ReportStatus,
    SeverityLevel,
)


# ─── PATCH /complaints/{id} body ──────────────────────────────────────────────

class ComplaintStatusPatch(BaseModel):
    """Request body for PATCH /complaints/{id}.

    Only the fields provided are applied — all are optional so callers
    can update status-only, notes-only, or both at once.
    """

    status: ReportStatus | None = Field(
        default=None,
        description="New lifecycle status for the complaint.",
    )
    officer_notes: str | None = Field(
        default=None,
        max_length=2000,
        description="Internal note added by a municipal officer.",
    )
    department: MunicipalDepartment | None = Field(
        default=None,
        description="Re-assign to a different municipal department.",
    )


# ─── GET /dashboard response ───────────────────────────────────────────────────

class StatusBreakdown(BaseModel):
    submitted: int = 0
    in_review: int = 0
    assigned: int = 0
    resolved: int = 0


class SeverityBreakdown(BaseModel):
    low: int = 0
    medium: int = 0
    high: int = 0
    critical: int = 0


class CategoryCount(BaseModel):
    category: IssueCategory
    count: int


class DepartmentCount(BaseModel):
    department: MunicipalDepartment
    count: int


class TrendPoint(BaseModel):
    date: str = Field(..., description="ISO-8601 date string, e.g. '2024-07-01'")
    count: int


class DashboardResponse(BaseModel):
    total_complaints: int
    open_complaints: int
    resolved_this_week: int
    avg_resolution_hours: float | None
    status_breakdown: StatusBreakdown
    severity_breakdown: SeverityBreakdown
    top_categories: list[CategoryCount]
    top_departments: list[DepartmentCount]
    daily_trend: list[TrendPoint] = Field(
        default_factory=list,
        description="Complaint volume for the last 7 days, oldest first.",
    )


# ─── GET /heatmap response ─────────────────────────────────────────────────────

class HeatmapPoint(BaseModel):
    id: str
    latitude: float
    longitude: float
    severity: SeverityLevel
    category: IssueCategory
    department: MunicipalDepartment
    status: ReportStatus
    weight: float = Field(
        ...,
        ge=1.0,
        le=5.0,
        description="Severity weight used by the frontend heatmap layer (1=low, 5=critical).",
    )
    reference: str = Field(..., description="Human-readable complaint reference, e.g. 'RPT-a1b2c3d4'.")
    summary: str = Field(..., description="One-line complaint summary for InfoWindow.")
    created_at: str


class HeatmapResponse(BaseModel):
    count: int
    points: list[HeatmapPoint]
