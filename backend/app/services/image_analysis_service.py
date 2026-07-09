from __future__ import annotations

import base64
from dataclasses import dataclass

from app.schemas.analysis import ImageAnalysisResponse
from app.schemas.report import IssueAnalysis
from app.services.issue_analyzer import IssueAnalyzer


@dataclass(frozen=True)
class ImageAnalysisRequest:
    image_bytes: bytes
    mime_type: str
    notes: str | None = None


class ImageAnalysisService:
    def __init__(self, analyzer: IssueAnalyzer) -> None:
        self.analyzer = analyzer

    async def analyze_image(self, request: ImageAnalysisRequest) -> ImageAnalysisResponse:
        image_base64 = base64.b64encode(request.image_bytes).decode("utf-8")
        issue_analysis = await self.analyzer.analyze(
            image_base64=image_base64,
            mime_type=request.mime_type,
            notes=request.notes,
            location_text=None,
        )
        return self._to_response(issue_analysis)

    def _to_response(self, analysis: IssueAnalysis) -> ImageAnalysisResponse:
        impact = self._build_impact(analysis)
        priority = self._priority_from_severity(analysis.severity.value)
        return ImageAnalysisResponse(
            category=analysis.category,
            severity=analysis.severity,
            confidence=analysis.confidence,
            department=analysis.department,
            impact=impact,
            priority=priority,
            complaint=analysis.complaint,
        )

    def _build_impact(self, analysis: IssueAnalysis) -> str:
        issue_label = analysis.issue.lower()
        department_label = analysis.department.value.replace("_", " ")
        return (
            f"{analysis.severity.value.capitalize()} impact issue detected: {issue_label}. "
            f"This should be handled by the {department_label} department to reduce public risk and service disruption."
        )

    def _priority_from_severity(self, severity: str) -> str:
        mapping = {
            "low": "Low",
            "medium": "Medium",
            "high": "High",
            "critical": "Urgent",
        }
        return mapping.get(severity, "Medium")
