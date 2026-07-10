"""
Pydantic schemas and enums shared across the complaints / reports API.

Enums
-----
IssueCategory     — 10 recognised civic issue types + unknown fallback
SeverityLevel     — low | medium | high | critical
ReportStatus      — submitted → in_review → assigned → resolved pipeline
MunicipalDepartment — 9 municipal departments for complaint routing

Key models
----------
ReportCreate  — inbound payload for POST /complaints (base64 image + metadata)
ReportRecord  — persisted record returned by all read/write endpoints
IssueAnalysis — embedded AI analysis result inside ReportRecord
"""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class IssueCategory(str, Enum):
    pothole = "pothole"
    garbage = "garbage"
    streetlight = "streetlight"
    water_leakage = "water_leakage"
    illegal_parking = "illegal_parking"
    broken_road = "broken_road"
    traffic_signal = "traffic_signal"
    open_drain = "open_drain"
    construction_waste = "construction_waste"
    fallen_tree = "fallen_tree"
    unknown = "unknown"


class SeverityLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class ReportStatus(str, Enum):
    submitted = "submitted"
    in_review = "in_review"
    assigned = "assigned"
    resolved = "resolved"


class MunicipalDepartment(str, Enum):
    road_works = "road_works"
    sanitation = "sanitation"
    electricity = "electricity"
    water_supply = "water_supply"
    traffic = "traffic"
    public_works = "public_works"
    parks_and_trees = "parks_and_trees"
    enforcement = "enforcement"
    general_civic = "general_civic"


class Location(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    address: str | None = Field(default=None, max_length=255)
    ward: str | None = Field(default=None, max_length=120)


class ReportCreate(BaseModel):
    image_base64: str = Field(..., min_length=16)
    mime_type: str = Field(default="image/jpeg", max_length=120)
    notes: str | None = Field(default=None, max_length=1000)
    citizen_name: str | None = Field(default=None, max_length=120)
    citizen_contact: str | None = Field(default=None, max_length=120)
    location: Location | None = None


class IssueAnalysis(BaseModel):
    issue: str
    category: IssueCategory
    severity: SeverityLevel
    department: MunicipalDepartment
    complaint: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    suggested_next_action: str
    keywords: list[str] = Field(default_factory=list)
    analysis_source: str


class ReportStatusUpdate(BaseModel):
    status: ReportStatus
    officer_notes: str | None = Field(default=None, max_length=1000)


class ReportRecord(BaseModel):
    id: str
    image_digest: str
    mime_type: str
    notes: str | None = None
    citizen_name: str | None = None
    citizen_contact: str | None = None
    location: Location | None = None
    analysis: IssueAnalysis
    status: ReportStatus = ReportStatus.submitted
    officer_notes: str | None = None
    created_at: datetime
    updated_at: datetime
