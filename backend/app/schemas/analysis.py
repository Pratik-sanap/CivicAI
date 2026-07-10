"""Pydantic schemas for the /analyze endpoint.

GeminiAnalysisResult validates the raw JSON returned by Gemini.
ImageAnalysisResponse is the final API response that adds image_url.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class GeminiAnalysisResult(BaseModel):
    """Validates the strict JSON returned by Gemini Vision."""

    category: str = Field(
        ...,
        description="Civic issue category detected in the image.",
    )
    severity: str = Field(
        ...,
        description="Severity level: low, medium, high, or critical.",
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="AI confidence score between 0.0 and 1.0.",
    )
    department: str = Field(
        ...,
        description="Municipal department responsible for resolution.",
    )
    priority: str = Field(
        ...,
        description="Priority level: Low, Medium, High, or Urgent.",
    )
    reasoning: list[str] = Field(
        ...,
        min_length=1,
        description="List of observations supporting the analysis.",
    )
    estimated_impact: str = Field(
        ...,
        description="Potential impact if the issue is not resolved.",
    )
    estimated_resolution_time: str = Field(
        ...,
        description="Human-readable resolution time estimate.",
    )
    professional_complaint: str = Field(
        ...,
        description="Formal complaint text for municipal submission.",
    )


class ImageAnalysisResponse(BaseModel):
    """Final API response returned to the frontend."""

    category: str
    severity: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    department: str
    priority: str
    reasoning: list[str]
    estimated_impact: str
    estimated_resolution_time: str
    professional_complaint: str
    image_url: str = Field(
        ...,
        description="Public URL of the uploaded image in Supabase Storage.",
    )
