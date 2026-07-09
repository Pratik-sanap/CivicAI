from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.models.enums import UserRole


@dataclass(slots=True)
class User:
    id: UUID
    full_name: str
    email: str
    phone_number: str | None
    role: UserRole
    avatar_url: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime
