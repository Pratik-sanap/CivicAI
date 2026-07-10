"""Gemini Vision AI service.

This service is responsible ONLY for communicating with the Google Gemini API.
No business logic, no storage, no HTTP response formatting.

Uses the google-genai SDK (google.genai) — the current official SDK.
"""

from __future__ import annotations

import json
import logging
import re

from google import genai
from google.genai import types as genai_types

from app.prompts.analysis_prompt import ANALYSIS_PROMPT
from app.schemas.analysis import GeminiAnalysisResult

logger = logging.getLogger(__name__)


class GeminiServiceError(Exception):
    """Base exception for Gemini service failures."""


class GeminiConfigError(GeminiServiceError):
    """Raised when the Gemini API key is missing or invalid."""


class GeminiTimeoutError(GeminiServiceError):
    """Raised when the Gemini API call times out."""


class GeminiResponseError(GeminiServiceError):
    """Raised when Gemini returns an unparseable or invalid response."""


class GeminiService:
    """Dedicated service for Gemini Vision API communication."""

    def __init__(self, api_key: str, model: str = "gemini-2.0-flash") -> None:
        if not api_key:
            raise GeminiConfigError(
                "GEMINI_API_KEY is not configured. "
                "Set it in your .env file to enable AI analysis."
            )

        self._client = genai.Client(api_key=api_key)
        self._model = model
        logger.info("GeminiService initialized with model=%s", model)

    async def analyze_image(
        self,
        image_bytes: bytes,
        mime_type: str,
    ) -> GeminiAnalysisResult:
        """Send an image to Gemini Vision and return validated analysis.

        Args:
            image_bytes: Raw bytes of the uploaded image.
            mime_type: MIME type of the image (e.g. "image/jpeg").

        Returns:
            GeminiAnalysisResult with all required fields validated.

        Raises:
            GeminiTimeoutError: If Gemini does not respond in time.
            GeminiResponseError: If the response is not valid JSON or
                fails Pydantic validation.
        """
        image_part = genai_types.Part.from_bytes(
            data=image_bytes,
            mime_type=mime_type,
        )

        try:
            response = await self._client.aio.models.generate_content(
                model=self._model,
                contents=[ANALYSIS_PROMPT, image_part],
                config=genai_types.GenerateContentConfig(
                    temperature=0.2,
                    response_mime_type="application/json",
                ),
            )
        except Exception as exc:
            error_msg = str(exc).lower()
            if "timeout" in error_msg or "deadline" in error_msg:
                logger.error("Gemini API timed out: %s", exc)
                raise GeminiTimeoutError(
                    "Gemini AI took too long to respond. Please try again."
                ) from exc
            logger.error("Gemini API error: %s", exc)
            raise GeminiResponseError(
                f"Gemini AI returned an error: {exc}"
            ) from exc

        raw_text = response.text
        if not raw_text:
            raise GeminiResponseError(
                "Gemini returned an empty response. Please try with a clearer image."
            )

        parsed = self._parse_json(raw_text)
        return self._validate(parsed)

    def _parse_json(self, text: str) -> dict:
        """Strip any accidental markdown fences and parse JSON."""
        cleaned = text.strip()
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned)

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Last resort: try to extract a JSON object from the text
            match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    pass

            logger.error("Failed to parse Gemini response as JSON: %s", text[:500])
            raise GeminiResponseError(
                "Gemini returned a response that is not valid JSON. "
                "Please try again with a different image."
            )

    def _validate(self, data: dict) -> GeminiAnalysisResult:
        """Validate parsed JSON against the Pydantic schema."""
        try:
            # Normalize confidence if it came as a percentage
            if "confidence" in data:
                conf = data["confidence"]
                if isinstance(conf, (int, float)) and conf > 1.0:
                    data["confidence"] = conf / 100.0

            return GeminiAnalysisResult.model_validate(data)
        except Exception as exc:
            logger.error(
                "Gemini response failed Pydantic validation: %s — data: %s",
                exc,
                data,
            )
            raise GeminiResponseError(
                "Gemini returned a response with missing or invalid fields. "
                "Please try again."
            ) from exc
