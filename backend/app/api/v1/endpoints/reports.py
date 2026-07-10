"""
Legacy /reports router — kept for backward compatibility.

All new code should use /complaints instead. This router mirrors the
/complaints CRUD but with a simplified API and slightly different path
conventions (e.g. PATCH /reports/{id}/status instead of PATCH /complaints/{id}).
"""
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.v1.dependencies import get_report_service
from app.schemas.report import ReportCreate, ReportRecord, ReportStatusUpdate
from app.services.report_service import ReportService

# Prefer /complaints for all new integrations
router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("", response_model=ReportRecord, status_code=status.HTTP_201_CREATED)
async def create_report(
    payload: ReportCreate,
    service: ReportService = Depends(get_report_service),
) -> ReportRecord:
    return await service.create_report(payload)


@router.get("", response_model=list[ReportRecord])
async def list_reports(service: ReportService = Depends(get_report_service)) -> list[ReportRecord]:
    return service.list_reports()


@router.get("/{report_id}", response_model=ReportRecord)
async def get_report(report_id: str, service: ReportService = Depends(get_report_service)) -> ReportRecord:
    report = service.get_report(report_id)
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return report


@router.patch("/{report_id}/status", response_model=ReportRecord)
async def update_report_status(
    report_id: str,
    payload: ReportStatusUpdate,
    service: ReportService = Depends(get_report_service),
) -> ReportRecord:
    report = service.update_status(report_id, payload)
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return report
