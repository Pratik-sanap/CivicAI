from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from functools import lru_cache
import importlib
from typing import Any
from uuid import UUID

from app.core.config import get_settings


class SupabaseConfigurationError(RuntimeError):
    pass


@dataclass(frozen=True)
class SupabaseTableNames:
    users: str = "users"
    departments: str = "departments"
    complaints: str = "complaints"
    activity_logs: str = "activity_logs"


@lru_cache(maxsize=1)
def get_supabase_client() -> Any:
    settings = get_settings()
    supabase_url = settings.supabase_url
    supabase_key = settings.supabase_service_role_key or settings.supabase_anon_key

    if not supabase_url or not supabase_key:
        raise SupabaseConfigurationError(
            "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY."
        )

    create_client = _load_create_client()
    return create_client(supabase_url, supabase_key)


def _load_create_client() -> Any:
    candidate_modules = ("supabase.client", "supabase")
    for module_name in candidate_modules:
        try:
            module = importlib.import_module(module_name)
        except ModuleNotFoundError:
            continue

        create_client = getattr(module, "create_client", None)
        if callable(create_client):
            return create_client

    raise SupabaseConfigurationError(
        "Supabase client factory could not be imported. Install a compatible supabase package version."
    )


def normalize_supabase_value(value: Any) -> Any:
    if isinstance(value, Enum):
        return value.value
    if isinstance(value, UUID):
        return str(value)
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, dict):
        return {key: normalize_supabase_value(item) for key, item in value.items()}
    if isinstance(value, list):
        return [normalize_supabase_value(item) for item in value]
    return value


def normalize_supabase_payload(payload: dict[str, Any]) -> dict[str, Any]:
    return {key: normalize_supabase_value(value) for key, value in payload.items() if value is not None}


def parse_uuid(value: Any) -> UUID:
    if isinstance(value, UUID):
        return value
    return UUID(str(value))


def parse_datetime(value: Any) -> datetime:
    if isinstance(value, datetime):
        return value
    text = str(value).replace("Z", "+00:00")
    return datetime.fromisoformat(text)
