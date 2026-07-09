from __future__ import annotations

from enum import Enum


class UserRole(str, Enum):
    citizen = "citizen"
    municipal_authority = "municipal_authority"
    ngo = "ngo"
    housing_society = "housing_society"
    admin = "admin"


class ComplaintCategory(str, Enum):
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


class ComplaintSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class ComplaintPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class ComplaintStatus(str, Enum):
    submitted = "submitted"
    in_review = "in_review"
    assigned = "assigned"
    in_progress = "in_progress"
    resolved = "resolved"
    rejected = "rejected"
    closed = "closed"


class ActivityAction(str, Enum):
    created = "created"
    analyzed = "analyzed"
    assigned = "assigned"
    status_updated = "status_updated"
    comment_added = "comment_added"
    resolved = "resolved"
    reopened = "reopened"
