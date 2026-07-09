from __future__ import annotations

from decimal import Decimal
from typing import Any
from uuid import UUID

from app.db.supabase import (
    SupabaseTableNames,
    get_supabase_client,
    normalize_supabase_payload,
    parse_datetime,
    parse_uuid,
)
from app.models.activity_log import ActivityLog
from app.models.complaint import Complaint
from app.models.department import Department
from app.models.enums import ActivityAction, ComplaintCategory, ComplaintPriority, ComplaintSeverity, ComplaintStatus, UserRole
from app.models.user import User
from app.schemas.activity_log import ActivityLogCreate
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate
from app.schemas.department import DepartmentCreate, DepartmentUpdate
from app.schemas.user import UserCreate, UserUpdate


class SupabaseRepositoryError(RuntimeError):
    pass


class _BaseSupabaseRepository:
    table_name: str

    def __init__(self, client: Any | None = None) -> None:
        self.client = client or get_supabase_client()

    def _table(self) -> Any:
        return self.client.table(self.table_name)

    def _single_row(self, response: Any) -> dict[str, Any] | None:
        data = getattr(response, "data", None)
        if not data:
            return None
        if isinstance(data, list):
            return data[0] if data else None
        return data

    def _many_rows(self, response: Any) -> list[dict[str, Any]]:
        data = getattr(response, "data", None)
        if not data:
            return []
        if isinstance(data, list):
            return data
        return [data]


class UserRepository(_BaseSupabaseRepository):
    table_name = SupabaseTableNames.users

    def create(self, payload: UserCreate) -> User:
        response = self._table().insert(normalize_supabase_payload(payload.model_dump())).execute()
        row = self._single_row(response)
        if row is None:
            raise SupabaseRepositoryError("Unable to create user.")
        return _row_to_user(row)

    def get_by_id(self, user_id: UUID) -> User | None:
        response = self._table().select("*").eq("id", str(user_id)).limit(1).execute()
        row = self._single_row(response)
        return _row_to_user(row) if row else None

    def list(self) -> list[User]:
        response = self._table().select("*").order("created_at", desc=True).execute()
        return [_row_to_user(row) for row in self._many_rows(response)]

    def update(self, user_id: UUID, payload: UserUpdate) -> User | None:
        response = self._table().update(normalize_supabase_payload(payload.model_dump(exclude_none=True))).eq(
            "id", str(user_id)
        ).execute()
        row = self._single_row(response)
        return _row_to_user(row) if row else None


class DepartmentRepository(_BaseSupabaseRepository):
    table_name = SupabaseTableNames.departments

    def create(self, payload: DepartmentCreate) -> Department:
        response = self._table().insert(normalize_supabase_payload(payload.model_dump())).execute()
        row = self._single_row(response)
        if row is None:
            raise SupabaseRepositoryError("Unable to create department.")
        return _row_to_department(row)

    def get_by_id(self, department_id: UUID) -> Department | None:
        response = self._table().select("*").eq("id", str(department_id)).limit(1).execute()
        row = self._single_row(response)
        return _row_to_department(row) if row else None

    def get_by_code(self, code: str) -> Department | None:
        response = self._table().select("*").eq("code", code).limit(1).execute()
        row = self._single_row(response)
        return _row_to_department(row) if row else None

    def list(self) -> list[Department]:
        response = self._table().select("*").order("name", desc=False).execute()
        return [_row_to_department(row) for row in self._many_rows(response)]

    def update(self, department_id: UUID, payload: DepartmentUpdate) -> Department | None:
        response = self._table().update(normalize_supabase_payload(payload.model_dump(exclude_none=True))).eq(
            "id", str(department_id)
        ).execute()
        row = self._single_row(response)
        return _row_to_department(row) if row else None


class ComplaintRepository(_BaseSupabaseRepository):
    table_name = SupabaseTableNames.complaints

    def create(self, payload: ComplaintCreate) -> Complaint:
        response = self._table().insert(normalize_supabase_payload(payload.model_dump())).execute()
        row = self._single_row(response)
        if row is None:
            raise SupabaseRepositoryError("Unable to create complaint.")
        return _row_to_complaint(row)

    def get_by_id(self, complaint_id: UUID) -> Complaint | None:
        response = self._table().select("*").eq("id", str(complaint_id)).limit(1).execute()
        row = self._single_row(response)
        return _row_to_complaint(row) if row else None

    def get_by_number(self, complaint_number: str) -> Complaint | None:
        response = self._table().select("*").eq("complaint_number", complaint_number).limit(1).execute()
        row = self._single_row(response)
        return _row_to_complaint(row) if row else None

    def list(self) -> list[Complaint]:
        response = self._table().select("*").order("created_at", desc=True).execute()
        return [_row_to_complaint(row) for row in self._many_rows(response)]

    def list_by_user_id(self, user_id: UUID) -> list[Complaint]:
        response = self._table().select("*").eq("user_id", str(user_id)).order("created_at", desc=True).execute()
        return [_row_to_complaint(row) for row in self._many_rows(response)]

    def update(self, complaint_id: UUID, payload: ComplaintUpdate) -> Complaint | None:
        response = self._table().update(normalize_supabase_payload(payload.model_dump(exclude_none=True))).eq(
            "id", str(complaint_id)
        ).execute()
        row = self._single_row(response)
        return _row_to_complaint(row) if row else None

    def update_status(
        self,
        complaint_id: UUID,
        status: ComplaintStatus,
        officer_notes: str | None = None,
        assigned_department_id: UUID | None = None,
    ) -> Complaint | None:
        patch: dict[str, Any] = {"status": status}
        if officer_notes is not None:
            patch["officer_notes"] = officer_notes
        if assigned_department_id is not None:
            patch["department_id"] = str(assigned_department_id)

        if status == ComplaintStatus.assigned:
            patch["assigned_at"] = _utc_now_iso()
        if status == ComplaintStatus.resolved:
            patch["resolved_at"] = _utc_now_iso()

        response = self._table().update(normalize_supabase_payload(patch)).eq("id", str(complaint_id)).execute()
        row = self._single_row(response)
        return _row_to_complaint(row) if row else None


class ActivityLogRepository(_BaseSupabaseRepository):
    table_name = SupabaseTableNames.activity_logs

    def create(self, payload: ActivityLogCreate) -> ActivityLog:
        response = self._table().insert(normalize_supabase_payload(payload.model_dump())).execute()
        row = self._single_row(response)
        if row is None:
            raise SupabaseRepositoryError("Unable to create activity log.")
        return _row_to_activity_log(row)

    def list_by_complaint_id(self, complaint_id: UUID) -> list[ActivityLog]:
        response = self._table().select("*").eq("complaint_id", str(complaint_id)).order("created_at", desc=True).execute()
        return [_row_to_activity_log(row) for row in self._many_rows(response)]

    def list_by_user_id(self, user_id: UUID) -> list[ActivityLog]:
        response = self._table().select("*").eq("user_id", str(user_id)).order("created_at", desc=True).execute()
        return [_row_to_activity_log(row) for row in self._many_rows(response)]


def _utc_now_iso() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _row_to_user(row: dict[str, Any]) -> User:
    return User(
        id=parse_uuid(row["id"]),
        full_name=row["full_name"],
        email=row["email"],
        phone_number=row.get("phone_number"),
        role=UserRole(row["role"]),
        avatar_url=row.get("avatar_url"),
        is_active=bool(row.get("is_active", True)),
        created_at=parse_datetime(row["created_at"]),
        updated_at=parse_datetime(row["updated_at"]),
    )


def _row_to_department(row: dict[str, Any]) -> Department:
    return Department(
        id=parse_uuid(row["id"]),
        code=row["code"],
        name=row["name"],
        description=row.get("description"),
        contact_email=row.get("contact_email"),
        contact_phone=row.get("contact_phone"),
        is_active=bool(row.get("is_active", True)),
        created_at=parse_datetime(row["created_at"]),
        updated_at=parse_datetime(row["updated_at"]),
    )


def _row_to_complaint(row: dict[str, Any]) -> Complaint:
    return Complaint(
        id=parse_uuid(row["id"]),
        complaint_number=row["complaint_number"],
        user_id=parse_uuid(row["user_id"]),
        department_id=parse_uuid(row["department_id"]) if row.get("department_id") else None,
        title=row["title"],
        description=row["description"],
        category=ComplaintCategory(row["category"]),
        severity=ComplaintSeverity(row["severity"]),
        confidence=Decimal(str(row["confidence"])),
        priority=ComplaintPriority(row["priority"]),
        status=ComplaintStatus(row["status"]),
        impact=row["impact"],
        complaint_text=row["complaint_text"],
        analysis=dict(row.get("analysis") or {}),
        image_url=row.get("image_url"),
        image_path=row.get("image_path"),
        location_address=row.get("location_address"),
        ward=row.get("ward"),
        latitude=Decimal(str(row["latitude"])) if row.get("latitude") is not None else None,
        longitude=Decimal(str(row["longitude"])) if row.get("longitude") is not None else None,
        officer_notes=row.get("officer_notes"),
        assigned_at=parse_datetime(row["assigned_at"]) if row.get("assigned_at") else None,
        resolved_at=parse_datetime(row["resolved_at"]) if row.get("resolved_at") else None,
        created_at=parse_datetime(row["created_at"]),
        updated_at=parse_datetime(row["updated_at"]),
    )


def _row_to_activity_log(row: dict[str, Any]) -> ActivityLog:
    return ActivityLog(
        id=parse_uuid(row["id"]),
        complaint_id=parse_uuid(row["complaint_id"]),
        user_id=parse_uuid(row["user_id"]) if row.get("user_id") else None,
        action=ActivityAction(row["action"]),
        message=row["message"],
        metadata=dict(row.get("metadata") or {}),
        created_at=parse_datetime(row["created_at"]),
    )
