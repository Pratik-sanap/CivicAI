from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import UserRole


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=160)
    email: str = Field(..., min_length=5, max_length=254)
    phone_number: str | None = Field(default=None, max_length=32)
    role: UserRole = UserRole.citizen
    avatar_url: str | None = Field(default=None, max_length=500)
    is_active: bool = True


class UserCreate(UserBase):
    id: UUID


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=160)
    phone_number: str | None = Field(default=None, max_length=32)
    role: UserRole | None = None
    avatar_url: str | None = Field(default=None, max_length=500)
    is_active: bool | None = None


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
