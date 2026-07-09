from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.v1.dependencies import get_report_service
from app.schemas.dashboard import ComplaintStatusPatch
from app.schemas.report import (
    IssueCategory,
    MunicipalDepartment,
    ReportCreate,
    ReportRecord,
    ReportStatus,
    SeverityLevel,
)
from app.services.report_service import ReportService

router = APIRouter(prefix="/complaints", tags=["Complaints"])


# ─── POST /complaints ──────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=ReportRecord,
    status_code=status.HTTP_201_CREATED,
    summary="POST /complaints — Submit a new civic complaint with image analysis",
    description=(
        "Accepts a base64-encoded image plus optional citizen details and location. "
        "Runs the image through Gemini Vision, generates a complaint record, and "
        "persists it. Returns the full ReportRecord including AI analysis results."
    ),
)
async def create_complaint(
    payload: ReportCreate,
    service: ReportService = Depends(get_report_service),
) -> ReportRecord:
    """Create a new civic complaint. Triggers AI image analysis synchronously."""

    # ReportCreate already enforces: image_base64 min_length=16, mime_type max_length=120.
    # Additional guard: reject data-URI-only strings without base64 data.
    b64 = payload.image_base64.strip()
    if b64.startswith("data:") and "," not in b64:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="image_base64 appears to be a data-URI prefix with no base64 payload.",
        )

    return await service.create_report(payload)


# ─── GET /complaints ───────────────────────────────────────────────────────────

@router.get(
    "",
    response_model=list[ReportRecord],
    summary="GET /complaints — List all complaints with optional filters",
    description=(
        "Returns a paginated list of complaints ordered by creation date descending. "
        "All filter parameters are optional and can be combined."
    ),
)
def list_complaints(
    service: ReportService = Depends(get_report_service),
    filter_status: ReportStatus | None = Query(
        default=None,
        alias="status",
        description="Filter by lifecycle status.",
    ),
    filter_category: IssueCategory | None = Query(
        default=None,
        alias="category",
        description="Filter by issue category (e.g. 'pothole', 'garbage').",
    ),
    filter_severity: SeverityLevel | None = Query(
        default=None,
        alias="severity",
        description="Filter by severity level.",
    ),
    filter_department: MunicipalDepartment | None = Query(
        default=None,
        alias="department",
        description="Filter by responsible municipal department.",
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
        description="Maximum number of records to return (1–500).",
    ),
    offset: int = Query(
        default=0,
        ge=0,
        description="Number of records to skip (for pagination).",
    ),
) -> list[ReportRecord]:
    """List complaints. All filters are optional and stackable."""
    return service.list_reports(
        status=filter_status.value if filter_status else None,
        category=filter_category.value if filter_category else None,
        severity=filter_severity.value if filter_severity else None,
        department=filter_department.value if filter_department else None,
        limit=limit,
        offset=offset,
    )


# ─── GET /complaints/{id} ──────────────────────────────────────────────────────

@router.get(
    "/{complaint_id}",
    response_model=ReportRecord,
    summary="GET /complaints/{id} — Retrieve a single complaint by ID",
    description="Returns the full complaint record including AI analysis and current status.",
)
def get_complaint(
    complaint_id: str,
    service: ReportService = Depends(get_report_service),
) -> ReportRecord:
    """Fetch a single complaint record. Returns 404 if not found."""
    complaint = service.get_report(complaint_id)
    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint '{complaint_id}' not found.",
        )
    return complaint


# ─── PATCH /complaints/{id} ────────────────────────────────────────────────────

@router.patch(
    "/{complaint_id}",
    response_model=ReportRecord,
    summary="PATCH /complaints/{id} — Partially update status, notes, or department",
    description=(
        "Allows municipal officers to update any combination of: lifecycle status, "
        "officer notes, and department assignment. Only provided fields are applied — "
        "omitted fields are unchanged. Returns the updated complaint record."
    ),
)
def patch_complaint(
    complaint_id: str,
    payload: ComplaintStatusPatch,
    service: ReportService = Depends(get_report_service),
) -> ReportRecord:
    """Partially update a complaint. At least one field must be provided."""

    if payload.status is None and payload.officer_notes is None and payload.department is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="At least one field must be provided: 'status', 'officer_notes', or 'department'.",
        )

    updated = service.patch_report(
        report_id=complaint_id,
        status=payload.status,
        officer_notes=payload.officer_notes,
        department=payload.department.value if payload.department else None,
    )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint '{complaint_id}' not found.",
        )

    return updated
