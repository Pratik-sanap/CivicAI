from __future__ import annotations

from datetime import datetime, timezone
from hashlib import sha256
from uuid import uuid4

from app.repositories.report_repository import InMemoryReportRepository
from app.schemas.dashboard import (
    CategoryCount,
    DashboardResponse,
    DepartmentCount,
    HeatmapPoint,
    HeatmapResponse,
    SeverityBreakdown,
    StatusBreakdown,
    TrendPoint,
)
from app.schemas.report import (
    IssueCategory,
    MunicipalDepartment,
    ReportCreate,
    ReportRecord,
    ReportStatus,
    ReportStatusUpdate,
    SeverityLevel,
)
from app.services.issue_analyzer import IssueAnalyzer


class ReportService:
    def __init__(
        self,
        repository: InMemoryReportRepository,
        analyzer: IssueAnalyzer,
    ) -> None:
        self.repository = repository
        self.analyzer = analyzer

    # ── POST /complaints ───────────────────────────────────────────────────────

    async def create_report(self, payload: ReportCreate) -> ReportRecord:
        analysis = await self.analyzer.analyze(
            image_base64=payload.image_base64,
            mime_type=payload.mime_type,
            notes=payload.notes,
            location_text=self._location_text(payload.location),
        )
        now = _utc_now()
        report = ReportRecord(
            id=str(uuid4()),
            image_digest=self._digest(payload.image_base64),
            mime_type=payload.mime_type,
            notes=payload.notes,
            citizen_name=payload.citizen_name,
            citizen_contact=payload.citizen_contact,
            location=payload.location,
            analysis=analysis,
            status=ReportStatus.submitted,
            officer_notes=None,
            created_at=now,
            updated_at=now,
        )
        return self.repository.save_report(report)

    # ── GET /complaints ────────────────────────────────────────────────────────

    def list_reports(
        self,
        *,
        status: str | None = None,
        category: str | None = None,
        severity: str | None = None,
        department: str | None = None,
        limit: int = 200,
        offset: int = 0,
    ) -> list[ReportRecord]:
        return self.repository.list_reports(
            status=status,
            category=category,
            severity=severity,
            department=department,
            limit=limit,
            offset=offset,
        )

    # ── GET /complaints/{id} ───────────────────────────────────────────────────

    def get_report(self, report_id: str) -> ReportRecord | None:
        return self.repository.get_report(report_id)

    # ── PATCH /complaints/{id} ─────────────────────────────────────────────────

    def patch_report(
        self,
        report_id: str,
        status: ReportStatus | None,
        officer_notes: str | None,
        department: str | None,
    ) -> ReportRecord | None:
        existing = self.repository.get_report(report_id)
        if existing is None:
            return None

        # If no status provided, keep the existing one
        new_status = status if status is not None else existing.status

        return self.repository.update_status(
            report_id=report_id,
            status=new_status,
            officer_notes=officer_notes,
            department=department,
            updated_at=_utc_now(),
        )

    # ── Legacy update_status (kept for backward compat with old endpoint) ──────

    def update_status(
        self,
        report_id: str,
        payload: ReportStatusUpdate,
    ) -> ReportRecord | None:
        return self.repository.update_status(
            report_id=report_id,
            status=payload.status,
            officer_notes=payload.officer_notes,
            updated_at=_utc_now(),
        )

    # ── GET /dashboard ─────────────────────────────────────────────────────────

    def get_dashboard(self) -> DashboardResponse:
        raw = self.repository.get_dashboard_stats()

        status_raw: dict[str, int] = raw["status_breakdown"]  # type: ignore[assignment]
        severity_raw: dict[str, int] = raw["severity_breakdown"]  # type: ignore[assignment]

        return DashboardResponse(
            total_complaints=raw["total_complaints"],  # type: ignore[arg-type]
            open_complaints=raw["open_complaints"],  # type: ignore[arg-type]
            resolved_this_week=raw["resolved_this_week"],  # type: ignore[arg-type]
            avg_resolution_hours=raw["avg_resolution_hours"],  # type: ignore[arg-type]
            status_breakdown=StatusBreakdown(
                submitted=status_raw.get("submitted", 0),
                in_review=status_raw.get("in_review", 0),
                assigned=status_raw.get("assigned", 0),
                resolved=status_raw.get("resolved", 0),
            ),
            severity_breakdown=SeverityBreakdown(
                low=severity_raw.get("low", 0),
                medium=severity_raw.get("medium", 0),
                high=severity_raw.get("high", 0),
                critical=severity_raw.get("critical", 0),
            ),
            top_categories=[
                CategoryCount(category=IssueCategory(cat), count=cnt)
                for cat, cnt in raw["category_counter"]  # type: ignore[union-attr]
            ],
            top_departments=[
                DepartmentCount(department=MunicipalDepartment(dep), count=cnt)
                for dep, cnt in raw["department_counter"]  # type: ignore[union-attr]
            ],
            daily_trend=[
                TrendPoint(date=pt["date"], count=pt["count"])  # type: ignore[arg-type]
                for pt in raw["daily_trend"]  # type: ignore[union-attr]
            ],
        )

    # ── GET /heatmap ───────────────────────────────────────────────────────────

    def get_heatmap(self) -> HeatmapResponse:
        raw_points = self.repository.get_heatmap_points()
        points = [
            HeatmapPoint(
                id=p["id"],  # type: ignore[arg-type]
                latitude=p["latitude"],  # type: ignore[arg-type]
                longitude=p["longitude"],  # type: ignore[arg-type]
                severity=SeverityLevel(p["severity"]),
                category=IssueCategory(p["category"]),
                department=MunicipalDepartment(p["department"]),
                status=ReportStatus(p["status"]),
                weight=p["weight"],  # type: ignore[arg-type]
                reference=p["reference"],  # type: ignore[arg-type]
                summary=p["summary"],  # type: ignore[arg-type]
                created_at=p["created_at"],  # type: ignore[arg-type]
            )
            for p in raw_points
        ]
        return HeatmapResponse(count=len(points), points=points)

    # ── Private helpers ────────────────────────────────────────────────────────

    def _digest(self, image_base64: str) -> str:
        cleaned = image_base64.strip()
        if cleaned.startswith("data:") and "," in cleaned:
            cleaned = cleaned.split(",", 1)[1]
        return sha256(cleaned.encode("utf-8")).hexdigest()[:16]

    def _location_text(self, location: object | None) -> str | None:
        if location is None:
            return None
        parts: list[str] = []
        address = getattr(location, "address", None)
        ward = getattr(location, "ward", None)
        latitude = getattr(location, "latitude", None)
        longitude = getattr(location, "longitude", None)
        if address:
            parts.append(str(address))
        if ward:
            parts.append(f"Ward {ward}")
        if latitude is not None and longitude is not None:
            parts.append(f"{latitude:.5f}, {longitude:.5f}")
        return ", ".join(parts) if parts else None


def _utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(microsecond=0)
