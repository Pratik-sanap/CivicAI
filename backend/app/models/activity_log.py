from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.models.enums import ActivityAction


@dataclass(slots=True)
class ActivityLog:
    id: UUID
    complaint_id: UUID
    user_id: UUID | None
    action: ActivityAction
    message: str
    metadata: dict[str, object]
    created_at: datetime
