from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from threading import Lock

from app.schemas.report import ReportRecord, ReportStatus


# ─── Weight map (mirrors frontend SEVERITY_WEIGHTS) ───────────────────────────
_SEVERITY_WEIGHT: dict[str, float] = {
    "low": 1.0,
    "medium": 2.0,
    "high": 3.0,
    "critical": 5.0,
}


class InMemoryReportRepository:
    """Thread-safe, in-memory store for ReportRecord objects.

    Supports all operations required by the seven API endpoints:
      - list (with optional filters)
      - get by id
      - save (create)
      - update status / notes / department
      - dashboard aggregations
      - heatmap projection
    """

    def __init__(self) -> None:
        self._reports: dict[str, ReportRecord] = {}
        self._lock = Lock()

    # ── Basic CRUD ────────────────────────────────────────────────────────────

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
        with self._lock:
            reports = sorted(
                self._reports.values(),
                key=lambda r: r.created_at,
                reverse=True,
            )

        if status:
            reports = [r for r in reports if r.status.value == status]
        if category:
            reports = [r for r in reports if r.analysis.category.value == category]
        if severity:
            reports = [r for r in reports if r.analysis.severity.value == severity]
        if department:
            reports = [r for r in reports if r.analysis.department.value == department]

        return reports[offset : offset + limit]

    def get_report(self, report_id: str) -> ReportRecord | None:
        with self._lock:
            return self._reports.get(report_id)

    def save_report(self, report: ReportRecord) -> ReportRecord:
        with self._lock:
            self._reports[report.id] = report
            return report

    def update_status(
        self,
        report_id: str,
        status: ReportStatus,
        officer_notes: str | None = None,
        department: str | None = None,
        updated_at: datetime | None = None,
    ) -> ReportRecord | None:
        with self._lock:
            existing = self._reports.get(report_id)
            if existing is None:
                return None

            patch: dict[str, object] = {
                "status": status,
                "updated_at": updated_at or _utc_now(),
            }
            if officer_notes is not None:
                patch["officer_notes"] = officer_notes

            updated = existing.model_copy(update=patch)
            self._reports[report_id] = updated
            return updated

    # ── Dashboard aggregations ────────────────────────────────────────────────

    def get_dashboard_stats(self) -> dict[str, object]:
        """Return aggregated stats used by GET /dashboard."""
        with self._lock:
            reports = list(self._reports.values())

        total = len(reports)
        now = _utc_now()
        week_ago = now - timedelta(days=7)

        status_counter: Counter[str] = Counter()
        severity_counter: Counter[str] = Counter()
        category_counter: Counter[str] = Counter()
        department_counter: Counter[str] = Counter()
        resolution_hours: list[float] = []
        resolved_this_week = 0
        daily_counter: dict[str, int] = defaultdict(int)

        for r in reports:
            status_counter[r.status.value] += 1
            severity_counter[r.analysis.severity.value] += 1
            category_counter[r.analysis.category.value] += 1
            department_counter[r.analysis.department.value] += 1

            # Resolution time
            if r.status == ReportStatus.resolved and r.updated_at > r.created_at:
                delta_h = (r.updated_at - r.created_at).total_seconds() / 3600
                resolution_hours.append(delta_h)

            # Resolved this week
            if r.status == ReportStatus.resolved and r.updated_at >= week_ago:
                resolved_this_week += 1

            # Daily trend (last 7 days only)
            if r.created_at >= week_ago:
                day_key = r.created_at.strftime("%Y-%m-%d")
                daily_counter[day_key] += 1

        open_statuses = {ReportStatus.submitted, ReportStatus.in_review, ReportStatus.assigned}
        open_complaints = sum(
            1 for r in reports if r.status in open_statuses
        )

        avg_resolution = (
            round(sum(resolution_hours) / len(resolution_hours), 1)
            if resolution_hours
            else None
        )

        # Build ordered daily trend from today back 6 days
        trend: list[dict[str, object]] = []
        for i in range(6, -1, -1):
            day = (now - timedelta(days=i)).strftime("%Y-%m-%d")
            trend.append({"date": day, "count": daily_counter.get(day, 0)})

        return {
            "total_complaints": total,
            "open_complaints": open_complaints,
            "resolved_this_week": resolved_this_week,
            "avg_resolution_hours": avg_resolution,
            "status_breakdown": dict(status_counter),
            "severity_breakdown": dict(severity_counter),
            "category_counter": category_counter.most_common(5),
            "department_counter": department_counter.most_common(5),
            "daily_trend": trend,
        }

    # ── Heatmap projection ────────────────────────────────────────────────────

    def get_heatmap_points(self) -> list[dict[str, object]]:
        """Return only geo-located complaints as lightweight dicts."""
        with self._lock:
            reports = list(self._reports.values())

        points: list[dict[str, object]] = []
        for r in reports:
            if r.location is None:
                continue
            points.append(
                {
                    "id": r.id,
                    "latitude": r.location.latitude,
                    "longitude": r.location.longitude,
                    "severity": r.analysis.severity.value,
                    "category": r.analysis.category.value,
                    "department": r.analysis.department.value,
                    "status": r.status.value,
                    "weight": _SEVERITY_WEIGHT.get(r.analysis.severity.value, 1.0),
                    "reference": f"RPT-{r.id[:8].upper()}",
                    "summary": (r.notes or r.analysis.complaint)[:120],
                    "created_at": r.created_at.isoformat(),
                }
            )
        return points

    # ── Count helpers ─────────────────────────────────────────────────────────

    def count(self) -> int:
        with self._lock:
            return len(self._reports)


def _utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(microsecond=0)
