"""
Legacy image analysis service used by the /complaints and /reports pipelines.

IssueAnalyzer operates in two modes:
  1. Gemini REST mode  — sends a base64 image directly to the Gemini REST API
                         via httpx. Falls back to keyword mode on any error.
  2. Keyword fallback  — matches plain-text notes/location against KEYWORD_RULES
                         to produce a best-guess category/department assignment.

The primary pipeline (POST /analyze) uses GeminiService + google-genai SDK
instead, which provides richer output (priority, reasoning, estimated_impact,
estimated_resolution_time) and uploads the image to Supabase Storage.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from enum import Enum
from typing import Any

import httpx

from app.schemas.report import (
    IssueAnalysis,
    IssueCategory,
    MunicipalDepartment,
    SeverityLevel,
)


@dataclass(frozen=True)
class KeywordRule:
    keywords: tuple[str, ...]
    category: IssueCategory
    department: MunicipalDepartment
    severity: SeverityLevel
    issue: str
    suggested_next_action: str


KEYWORD_RULES: tuple[KeywordRule, ...] = (
    KeywordRule(
        keywords=("pothole", "crater", "road hole", "road damage"),
        category=IssueCategory.pothole,
        department=MunicipalDepartment.road_works,
        severity=SeverityLevel.high,
        issue="Pothole",
        suggested_next_action="Dispatch a road repair crew and schedule patchwork within 24 hours.",
    ),
    KeywordRule(
        keywords=("garbage", "trash", "waste", "dumping", "litter"),
        category=IssueCategory.garbage,
        department=MunicipalDepartment.sanitation,
        severity=SeverityLevel.medium,
        issue="Garbage accumulation",
        suggested_next_action="Assign sanitation staff and clear the site on priority.",
    ),
    KeywordRule(
        keywords=("streetlight", "street light", "light outage", "lamp"),
        category=IssueCategory.streetlight,
        department=MunicipalDepartment.electricity,
        severity=SeverityLevel.medium,
        issue="Broken streetlight",
        suggested_next_action="Log an electrical maintenance ticket and restore lighting promptly.",
    ),
    KeywordRule(
        keywords=("water leakage", "water leak", "leakage", "pipeline burst", "pipe burst"),
        category=IssueCategory.water_leakage,
        department=MunicipalDepartment.water_supply,
        severity=SeverityLevel.high,
        issue="Water leakage",
        suggested_next_action="Alert the water supply team to isolate and repair the leak.",
    ),
    KeywordRule(
        keywords=("illegal parking", "double parked", "blocked driveway", "wrong parking"),
        category=IssueCategory.illegal_parking,
        department=MunicipalDepartment.enforcement,
        severity=SeverityLevel.medium,
        issue="Illegal parking",
        suggested_next_action="Forward the case to enforcement for immediate on-ground action.",
    ),
    KeywordRule(
        keywords=("broken road", "damaged road", "road collapse", "cracked road"),
        category=IssueCategory.broken_road,
        department=MunicipalDepartment.public_works,
        severity=SeverityLevel.high,
        issue="Damaged road surface",
        suggested_next_action="Escalate to public works for repair assessment and barricading.",
    ),
    KeywordRule(
        keywords=("traffic signal", "signal failure", "broken signal", "signal light"),
        category=IssueCategory.traffic_signal,
        department=MunicipalDepartment.traffic,
        severity=SeverityLevel.critical,
        issue="Traffic signal failure",
        suggested_next_action="Notify traffic control to restore the signal immediately.",
    ),
    KeywordRule(
        keywords=("open drain", "drain overflow", "sewage drain", "storm drain"),
        category=IssueCategory.open_drain,
        department=MunicipalDepartment.public_works,
        severity=SeverityLevel.high,
        issue="Open drain",
        suggested_next_action="Arrange barricading and send a drainage crew for repair.",
    ),
    KeywordRule(
        keywords=("construction waste", "debris", "rubble", "building waste"),
        category=IssueCategory.construction_waste,
        department=MunicipalDepartment.sanitation,
        severity=SeverityLevel.medium,
        issue="Construction waste",
        suggested_next_action="Coordinate waste removal and identify the responsible site owner.",
    ),
    KeywordRule(
        keywords=("fallen tree", "tree fallen", "tree branch", "uprooted tree"),
        category=IssueCategory.fallen_tree,
        department=MunicipalDepartment.parks_and_trees,
        severity=SeverityLevel.high,
        issue="Fallen tree",
        suggested_next_action="Send parks and trees staff with clearance equipment.",
    ),
)


def _strip_data_uri(image_base64: str) -> str:
    cleaned = image_base64.strip()
    if cleaned.startswith("data:") and "," in cleaned:
        return cleaned.split(",", 1)[1]
    return cleaned


def _extract_text(payload: dict[str, Any]) -> str:
    candidates = payload.get("candidates") or []
    parts: list[str] = []
    for candidate in candidates:
        content = candidate.get("content") or {}
        for part in content.get("parts") or []:
            text = part.get("text")
            if text:
                parts.append(text)
    return "\n".join(parts).strip()


def _extract_json(text: str) -> dict[str, Any] | None:
    candidate = text.strip()
    candidate = re.sub(r"^```(?:json)?\s*", "", candidate, flags=re.IGNORECASE)
    candidate = re.sub(r"\s*```$", "", candidate)

    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", candidate, flags=re.DOTALL)
        if match is None:
            return None
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return None


def _format_location(notes: str | None, location_text: str) -> str:
    if location_text:
        return location_text
    if notes:
        return notes
    return "the reported location"


class IssueAnalyzer:
    def __init__(self, api_key: str | None = None, model: str = "gemini-1.5-flash") -> None:
        self.api_key = api_key
        self.model = model

    async def analyze(
        self,
        image_base64: str,
        mime_type: str,
        notes: str | None = None,
        location_text: str | None = None,
    ) -> IssueAnalysis:
        if self.api_key:
            try:
                return await self._analyze_with_gemini(image_base64, mime_type, notes, location_text)
            except Exception:
                return self._fallback_analysis(notes, location_text)

        return self._fallback_analysis(notes, location_text)

    async def _analyze_with_gemini(
        self,
        image_base64: str,
        mime_type: str,
        notes: str | None,
        location_text: str | None,
    ) -> IssueAnalysis:
        prompt = (
            "You are analyzing a civic issue report image. "
            "Return only valid JSON with these keys: issue, category, severity, department, complaint, confidence, suggested_next_action, keywords. "
            "Categories must be one of: pothole, garbage, streetlight, water_leakage, illegal_parking, broken_road, traffic_signal, open_drain, construction_waste, fallen_tree, unknown. "
            "Departments must be one of: road_works, sanitation, electricity, water_supply, traffic, public_works, parks_and_trees, enforcement, general_civic. "
            "Severity must be one of: low, medium, high, critical. "
            f"Location context: {_format_location(notes, location_text)}. "
            f"Citizen notes: {notes or 'None provided'}."
        )
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": _strip_data_uri(image_base64),
                            }
                        },
                    ],
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json",
            },
        }

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.model}:generateContent?key={self.api_key}"
        )
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()

        text = _extract_text(data)
        parsed = _extract_json(text)
        if parsed is None:
            return self._fallback_analysis(notes, location_text)

        return self._analysis_from_payload(parsed, notes, location_text, source="gemini")

    def _analysis_from_payload(
        self,
        payload: dict[str, Any],
        notes: str | None,
        location_text: str | None,
        source: str,
    ) -> IssueAnalysis:
        keywords = payload.get("keywords") or []
        if isinstance(keywords, str):
            keywords = [keywords]

        return IssueAnalysis(
            issue=str(payload.get("issue") or "Unknown civic issue"),
            category=self._coerce_enum(IssueCategory, payload.get("category"), IssueCategory.unknown),
            severity=self._coerce_enum(SeverityLevel, payload.get("severity"), SeverityLevel.medium),
            department=self._coerce_enum(
                MunicipalDepartment,
                payload.get("department"),
                MunicipalDepartment.general_civic,
            ),
            complaint=str(
                payload.get("complaint")
                or self._build_complaint(
                    issue=str(payload.get("issue") or "civic issue"),
                    severity=self._coerce_enum(SeverityLevel, payload.get("severity"), SeverityLevel.medium),
                    location_text=location_text,
                    notes=notes,
                    department=self._coerce_enum(
                        MunicipalDepartment,
                        payload.get("department"),
                        MunicipalDepartment.general_civic,
                    ),
                )
            ),
            confidence=self._coerce_confidence(payload.get("confidence")),
            suggested_next_action=str(
                payload.get("suggested_next_action")
                or "Review the report and dispatch the appropriate municipal team."
            ),
            keywords=[str(keyword) for keyword in keywords if str(keyword).strip()],
            analysis_source=source,
        )

    def _fallback_analysis(self, notes: str | None, location_text: str | None) -> IssueAnalysis:
        haystack = f"{notes or ''} {location_text or ''}".lower()
        matched_rule = next(
            (rule for rule in KEYWORD_RULES if any(keyword in haystack for keyword in rule.keywords)),
            None,
        )

        if matched_rule is None:
            return IssueAnalysis(
                issue="Unknown civic issue",
                category=IssueCategory.unknown,
                severity=SeverityLevel.medium,
                department=MunicipalDepartment.general_civic,
                complaint=self._build_complaint(
                    issue="civic issue",
                    severity=SeverityLevel.medium,
                    location_text=location_text,
                    notes=notes,
                    department=MunicipalDepartment.general_civic,
                ),
                confidence=0.35,
                suggested_next_action="Review the image manually and assign it to the appropriate department.",
                keywords=self._tokens_from_text(haystack),
                analysis_source="fallback",
            )

        return IssueAnalysis(
            issue=matched_rule.issue,
            category=matched_rule.category,
            severity=matched_rule.severity,
            department=matched_rule.department,
            complaint=self._build_complaint(
                issue=matched_rule.issue.lower(),
                severity=matched_rule.severity,
                location_text=location_text,
                notes=notes,
                department=matched_rule.department,
            ),
            confidence=0.78,
            suggested_next_action=matched_rule.suggested_next_action,
            keywords=self._tokens_from_text(haystack),
            analysis_source="fallback",
        )

    def _build_complaint(
        self,
        issue: str,
        severity: SeverityLevel,
        location_text: str | None,
        notes: str | None,
        department: MunicipalDepartment,
    ) -> str:
        location_phrase = _format_location(notes, location_text)
        return (
            f"A {severity.value} {issue} has been reported at {location_phrase}. "
            f"Please route this complaint to the {department.value.replace('_', ' ')} team and arrange prompt action "
            "to protect public safety and keep the area operational."
        )

    def _tokens_from_text(self, text: str) -> list[str]:
        tokens = re.findall(r"[a-z0-9]+", text.lower())
        return sorted(set(tokens))[:12]

    def _coerce_enum(self, enum_type: type[Enum], value: Any, default: Enum) -> Enum:
        if isinstance(value, enum_type):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower().replace(" ", "_")
            try:
                return enum_type(normalized)
            except ValueError:
                return default
        return default

    def _coerce_confidence(self, value: Any) -> float:
        try:
            confidence = float(value)
        except (TypeError, ValueError):
            confidence = 0.75

        if confidence > 1.0:
            confidence = confidence / 100.0
        return max(0.0, min(confidence, 1.0))
