"""Legacy image analysis service.

Wraps the old IssueAnalyzer for backward compatibility with
the /analysis/image endpoint. New code should use GeminiService directly.
"""

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
        reasoning = [
            f"Detected issue: {analysis.issue}",
            f"Category: {analysis.category.value}",
            f"Severity: {analysis.severity.value}",
            f"Recommended department: {analysis.department.value}",
        ]
        complaint = (
            analysis.complaint
            or f"A {analysis.severity.value} {analysis.issue} has been reported. "
               f"Please route to the {analysis.department.value} department."
        )
        return ImageAnalysisResponse(
            category=analysis.category.value,
            severity=analysis.severity.value,
            confidence=analysis.confidence,
            department=analysis.department.value,
            priority=priority,
            reasoning=reasoning,
            estimated_impact=impact,
            estimated_resolution_time=self._resolution_from_severity(analysis.severity.value),
            professional_complaint=complaint,
            image_url="",
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

    def _resolution_from_severity(self, severity: str) -> str:
        mapping = {
            "low": "5-7 business days",
            "medium": "3-5 business days",
            "high": "1-2 business days",
            "critical": "24 hours",
        }
        return mapping.get(severity, "3-5 business days")
