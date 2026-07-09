from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.report import IssueCategory, MunicipalDepartment, SeverityLevel


class ImageAnalysisResponse(BaseModel):
    category: IssueCategory
    severity: SeverityLevel
    confidence: float = Field(..., ge=0.0, le=1.0)
    department: MunicipalDepartment
    impact: str
    priority: str
    complaint: str
