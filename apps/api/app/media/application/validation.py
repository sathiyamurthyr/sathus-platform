"""Upload validation engine."""

import os
from typing import Any

from app.core.config import get_settings
from app.core.logging import logger
from app.media.domain.upload_exceptions import (
    FileTooLargeError,
    UnsupportedMediaTypeError,
    UploadValidationError,
)


class UploadValidator:
    """Validates file uploads against configuration rules."""

    def __init__(self):
        """Initialize upload validator."""
        self.settings = get_settings()

    def validate(
        self,
        filename: str,
        content_type: str,
        file_size: int,
        data: bytes | None = None,
    ) -> dict[str, Any]:
        """Validate a file upload.

        Args:
            filename: Original filename from client.
            content_type: MIME type of the file.
            file_size: Size of the file in bytes.
            data: Optional file data for checksum validation.

        Returns:
            Validation result with metadata.

        Raises:
            UploadValidationError: If validation fails.
            FileTooLargeError: If file exceeds maximum size.
            UnsupportedMediaTypeError: If file type is not supported.
        """
        # Validate file size
        max_size = self.settings.MAX_FILE_SIZE_MB * 1024 * 1024
        if file_size > max_size:
            logger.warning(
                "validation_failed",
                reason="file_too_large",
                size=file_size,
                max_size=max_size,
            )
            raise FileTooLargeError(file_size, max_size)

        # Validate MIME type
        allowed_mime_types = (
            self.settings.ALLOWED_IMAGE_MIME_TYPES
            + self.settings.ALLOWED_DOCUMENT_MIME_TYPES
            + self.settings.ALLOWED_ARCHIVE_MIME_TYPES
            + self.settings.ALLOWED_VIDEO_MIME_TYPES
        )
        if content_type not in allowed_mime_types:
            logger.warning(
                "validation_failed",
                reason="unsupported_media_type",
                content_type=content_type,
            )
            raise UnsupportedMediaTypeError(content_type)

        # Validate extension
        extension = self._get_extension(filename)
        allowed_extensions = (
            self.settings.ALLOWED_IMAGE_EXTENSIONS
            + self.settings.ALLOWED_DOCUMENT_EXTENSIONS
            + self.settings.ALLOWED_ARCHIVE_EXTENSIONS
            + self.settings.ALLOWED_VIDEO_EXTENSIONS
        )
        if extension.lower() not in [e.lower() for e in allowed_extensions]:
            logger.warning(
                "validation_failed",
                reason="invalid_extension",
                extension=extension,
            )
            raise UploadValidationError(f"Invalid file extension: {extension}")

        # Validate filename safety
        if not self._is_filename_safe(filename):
            logger.warning(
                "validation_failed",
                reason="unsafe_filename",
                filename=filename,
            )
            raise UploadValidationError("Unsafe filename detected")

        # Calculate checksum if data provided
        checksum = None
        if data:
            import hashlib
            checksum = hashlib.sha256(data).hexdigest()
            logger.info("checksum_generated", checksum=checksum)

        return {
            "valid": True,
            "extension": extension,
            "checksum": checksum,
            "content_type": content_type,
        }

    def _get_extension(self, filename: str) -> str:
        """Get file extension from filename."""
        _, ext = os.path.splitext(filename)
        return ext

    def _is_filename_safe(self, filename: str) -> bool:
        """Check if filename is safe (no path traversal)."""
        # Check for path traversal attempts
        if ".." in filename or "/" in filename or "\\" in filename:
            return False
        # Check for null bytes
        if "\x00" in filename:
            return False
        return True

    def get_allowed_mime_types(self) -> list[str]:
        """Get all allowed MIME types."""
        return (
            self.settings.ALLOWED_IMAGE_MIME_TYPES
            + self.settings.ALLOWED_DOCUMENT_MIME_TYPES
            + self.settings.ALLOWED_ARCHIVE_MIME_TYPES
            + self.settings.ALLOWED_VIDEO_MIME_TYPES
        )

    def get_allowed_extensions(self) -> list[str]:
        """Get all allowed extensions."""
        return (
            self.settings.ALLOWED_IMAGE_EXTENSIONS
            + self.settings.ALLOWED_DOCUMENT_EXTENSIONS
            + self.settings.ALLOWED_ARCHIVE_EXTENSIONS
            + self.settings.ALLOWED_VIDEO_EXTENSIONS
        )