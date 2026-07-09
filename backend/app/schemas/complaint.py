from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ComplaintCategory, ComplaintPriority, ComplaintSeverity, ComplaintStatus


class ComplaintBase(BaseModel):
    user_id: UUID
    department_id: UUID | None = None
    title: str = Field(..., min_length=3, max_length=220)
    description: str = Field(..., min_length=10, max_length=4000)
    category: ComplaintCategory
    severity: ComplaintSeverity
    confidence: Decimal = Field(..., ge=0, le=1)
    priority: ComplaintPriority
    status: ComplaintStatus = ComplaintStatus.submitted
    impact: str = Field(..., min_length=3, max_length=2000)
    complaint_text: str = Field(..., min_length=10, max_length=6000)
    analysis: dict[str, Any] = Field(default_factory=dict)
    image_url: str | None = Field(default=None, max_length=500)
    image_path: str | None = Field(default=None, max_length=500)
    location_address: str | None = Field(default=None, max_length=255)
    ward: str | None = Field(default=None, max_length=120)
    latitude: Decimal | None = Field(default=None, ge=-90, le=90)
    longitude: Decimal | None = Field(default=None, ge=-180, le=180)
    officer_notes: str | None = Field(default=None, max_length=2000)


class ComplaintCreate(ComplaintBase):
    pass


class ComplaintUpdate(BaseModel):
    department_id: UUID | None = None
    status: ComplaintStatus | None = None
    officer_notes: str | None = Field(default=None, max_length=2000)
    resolved_at: datetime | None = None
    assigned_at: datetime | None = None


class ComplaintRead(ComplaintBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    complaint_number: str
    assigned_at: datetime | None = None
    resolved_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
