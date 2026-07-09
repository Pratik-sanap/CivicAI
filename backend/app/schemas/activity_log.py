from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ActivityAction


class ActivityLogBase(BaseModel):
    complaint_id: UUID
    user_id: UUID | None = None
    action: ActivityAction
    message: str = Field(..., min_length=3, max_length=2000)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ActivityLogCreate(ActivityLogBase):
    pass


class ActivityLogRead(ActivityLogBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
