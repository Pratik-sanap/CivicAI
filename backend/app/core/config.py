from __future__ import annotations

from dataclasses import dataclass, field
import os
from typing import Tuple


def _split_csv(value: str | None, default: tuple[str, ...]) -> tuple[str, ...]:
    if not value:
        return default

    items = tuple(item.strip() for item in value.split(",") if item.strip())
    return items or default


@dataclass(frozen=True)
class Settings:
    project_name: str = "CivicAI API"
    api_v1_prefix: str = "/api/v1"
    environment: str = os.getenv("ENVIRONMENT", "development")
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY") or None
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    supabase_url: str | None = os.getenv("SUPABASE_URL") or None
    supabase_service_role_key: str | None = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or None
    supabase_anon_key: str | None = os.getenv("SUPABASE_ANON_KEY") or None
    supabase_schema: str = os.getenv("SUPABASE_SCHEMA", "public")
    frontend_origins: tuple[str, ...] = field(
        default_factory=lambda: _split_csv(
            os.getenv("FRONTEND_ORIGINS"),
            ("http://localhost:5173", "http://127.0.0.1:5173"),
        )
    )


_SETTINGS = Settings()


def get_settings() -> Settings:
    return _SETTINGS
