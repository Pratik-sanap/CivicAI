from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from uuid import UUID

from app.models.enums import ComplaintCategory, ComplaintPriority, ComplaintSeverity, ComplaintStatus


@dataclass(slots=True)
class Complaint:
    id: UUID
    complaint_number: str
    user_id: UUID
    department_id: UUID | None
    title: str
    description: str
    category: ComplaintCategory
    severity: ComplaintSeverity
    confidence: Decimal
    priority: ComplaintPriority
    status: ComplaintStatus
    impact: str
    complaint_text: str
    analysis: dict[str, object]
    image_url: str | None
    image_path: str | None
    location_address: str | None
    ward: str | None
    latitude: Decimal | None
    longitude: Decimal | None
    officer_notes: str | None
    assigned_at: datetime | None
    resolved_at: datetime | None
    created_at: datetime
    updated_at: datetime
