"""Supabase Storage service.

Handles image uploads to Supabase Storage and returns public URLs.
No database operations — storage only.
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone

from supabase import Client, create_client

logger = logging.getLogger(__name__)


class StorageServiceError(Exception):
    """Raised when a Supabase Storage operation fails."""


class StorageConfigError(StorageServiceError):
    """Raised when Supabase credentials are missing."""


class StorageService:
    """Uploads images to Supabase Storage and returns public URLs."""

    def __init__(
        self,
        supabase_url: str,
        supabase_service_role_key: str,
        bucket_name: str = "civic-uploads",
    ) -> None:
        if not supabase_url or not supabase_service_role_key:
            raise StorageConfigError(
                "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required. "
                "Set them in your .env file."
            )

        try:
            self._client: Client = create_client(supabase_url, supabase_service_role_key)
        except Exception as exc:
            raise StorageConfigError(
                f"Failed to create Supabase client — check that SUPABASE_SERVICE_ROLE_KEY "
                f"is a valid JWT (starts with 'eyJ...'). Error: {exc}"
            ) from exc
        self._bucket = bucket_name
        self._supabase_url = supabase_url.rstrip("/")
        logger.info(
            "StorageService initialized: bucket=%s url=%s",
            bucket_name,
            supabase_url,
        )

    async def upload_image(
        self,
        image_bytes: bytes,
        mime_type: str,
        original_filename: str | None = None,
    ) -> str:
        """Upload an image to Supabase Storage and return the public URL.

        Args:
            image_bytes: Raw bytes of the image file.
            mime_type: MIME type (e.g. "image/jpeg").
            original_filename: Original filename for extension detection.

        Returns:
            Public URL string of the uploaded image.

        Raises:
            StorageServiceError: If the upload fails for any reason.
        """
        extension = self._extension_from_mime(mime_type, original_filename)
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        unique_id = uuid.uuid4().hex[:12]
        file_path = f"reports/{timestamp}_{unique_id}{extension}"

        try:
            self._client.storage.from_(self._bucket).upload(
                path=file_path,
                file=image_bytes,
                file_options={
                    "content-type": mime_type,
                    "upsert": "false",
                },
            )
        except Exception as exc:
            logger.error("Supabase Storage upload failed: %s", exc)
            raise StorageServiceError(
                f"Failed to upload image to storage: {exc}"
            ) from exc

        public_url = (
            f"{self._supabase_url}/storage/v1/object/public/"
            f"{self._bucket}/{file_path}"
        )

        logger.info("Image uploaded: %s", public_url)
        return public_url

    def _extension_from_mime(
        self, mime_type: str, filename: str | None
    ) -> str:
        """Derive file extension from MIME type or original filename."""
        mime_map = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "image/gif": ".gif",
            "image/heic": ".heic",
        }

        ext = mime_map.get(mime_type.lower())
        if ext:
            return ext

        if filename and "." in filename:
            return "." + filename.rsplit(".", 1)[-1].lower()

        return ".jpg"
