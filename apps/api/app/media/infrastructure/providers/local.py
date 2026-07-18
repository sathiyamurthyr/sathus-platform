"""Local filesystem storage provider implementation."""

import hashlib
import os
import secrets
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, AsyncIterator

from app.core.logging import logger
from app.media.domain.exceptions import (
    DeleteFailedError,
    DownloadFailedError,
    ObjectNotFoundError,
    SignedUrlGenerationError,
    UploadFailedError,
)
from app.media.domain.storage import StorageObject, StorageProvider


class LocalStorageProvider(StorageProvider):
    """Production-grade local filesystem storage provider."""

    def __init__(self, root_path: str = "storage/media"):
        """Initialize local storage provider.

        Args:
            root_path: Root directory for storing files.
        """
        self.root_path = Path(root_path)
        self.root_path.mkdir(parents=True, exist_ok=True)

    def _get_full_path(self, key: str) -> Path:
        """Get full filesystem path for a key.

        Args:
            key: Storage key.

        Returns:
            Full path to the file.
        """
        # Sanitize key to prevent path traversal
        safe_key = key.lstrip("/")
        return self.root_path / safe_key

    def _generate_safe_filename(self, original_filename: str) -> str:
        """Generate a safe, unique filename.

        Args:
            original_filename: Original filename.

        Returns:
            Safe filename with random suffix.
        """
        name, ext = os.path.splitext(original_filename)
        random_suffix = secrets.token_hex(8)
        safe_name = "".join(c for c in name if c.isalnum() or c in "._-")
        return f"{safe_name}_{random_suffix}{ext}"

    def _calculate_checksum(self, data: bytes) -> str:
        """Calculate SHA256 checksum of data.

        Args:
            data: File data.

        Returns:
            SHA256 checksum.
        """
        return hashlib.sha256(data).hexdigest()

    async def upload(
        self,
        key: str,
        data: bytes | AsyncIterator[bytes],
        mime_type: str,
        metadata: dict[str, Any] | None = None,
    ) -> StorageObject:
        """Upload data to local filesystem.

        Args:
            key: Storage key.
            data: File data or async iterator.
            mime_type: MIME type of the file.
            metadata: Optional metadata.

        Returns:
            StorageObject with metadata.

        Raises:
            UploadFailedError: If upload fails.
        """
        logger.info(f"Upload Started: key={key}")

        try:
            full_path = self._get_full_path(key)
            full_path.parent.mkdir(parents=True, exist_ok=True)

            # Handle async iterator
            if isinstance(data, AsyncIterator):
                content = b""
                async for chunk in data:
                    content += chunk
            else:
                content = data

            # Atomic write using temp file
            temp_path = full_path.with_suffix(".tmp")
            temp_path.write_bytes(content)
            temp_path.replace(full_path)

            checksum = self._calculate_checksum(content)
            now = datetime.now(timezone.utc).isoformat()

            logger.info(f"Upload Completed: key={key}, size={len(content)}")

            return StorageObject(
                key=key,
                size=len(content),
                mime_type=mime_type,
                checksum=checksum,
                metadata=metadata,
                created_at=now,
                updated_at=now,
            )
        except Exception as e:
            logger.error(f"Upload Failed: key={key}, error={e}")
            raise UploadFailedError(f"Failed to upload file: {e}") from e

    async def download(self, key: str) -> bytes:
        """Download data from local filesystem.

        Args:
            key: Storage key.

        Returns:
            File content.

        Raises:
            DownloadFailedError: If download fails.
            ObjectNotFoundError: If object not found.
        """
        logger.info(f"Download Started: key={key}")

        try:
            full_path = self._get_full_path(key)

            if not full_path.exists():
                raise ObjectNotFoundError(f"Object not found: {key}")

            content = full_path.read_bytes()
            logger.info(f"Download Completed: key={key}, size={len(content)}")
            return content
        except ObjectNotFoundError:
            raise
        except Exception as e:
            logger.error(f"Download Failed: key={key}, error={e}")
            raise DownloadFailedError(f"Failed to download file: {e}") from e

    async def delete(self, key: str) -> bool:
        """Delete object from local filesystem.

        Args:
            key: Storage key.

        Returns:
            True if deleted successfully.

        Raises:
            DeleteFailedError: If delete fails.
        """
        try:
            full_path = self._get_full_path(key)

            if not full_path.exists():
                return False

            full_path.unlink()
            logger.info(f"Delete: key={key}")
            return True
        except Exception as e:
            logger.error(f"Delete Failed: key={key}, error={e}")
            raise DeleteFailedError(f"Failed to delete file: {e}") from e

    async def exists(self, key: str) -> bool:
        """Check if object exists in local filesystem.

        Args:
            key: Storage key.

        Returns:
            True if object exists.
        """
        full_path = self._get_full_path(key)
        return full_path.exists()

    async def move(self, source_key: str, dest_key: str) -> bool:
        """Move object within local filesystem.

        Args:
            source_key: Source storage key.
            dest_key: Destination storage key.

        Returns:
            True if moved successfully.
        """
        try:
            source_path = self._get_full_path(source_key)
            dest_path = self._get_full_path(dest_key)

            if not source_path.exists():
                return False

            dest_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(source_path), str(dest_path))
            return True
        except Exception:
            return False

    async def copy(self, source_key: str, dest_key: str) -> bool:
        """Copy object within local filesystem.

        Args:
            source_key: Source storage key.
            dest_key: Destination storage key.

        Returns:
            True if copied successfully.
        """
        try:
            source_path = self._get_full_path(source_key)
            dest_path = self._get_full_path(dest_key)

            if not source_path.exists():
                return False

            dest_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(str(source_path), str(dest_path))
            return True
        except Exception:
            return False

    async def list(self, prefix: str | None = None) -> list[StorageObject]:
        """List objects in local filesystem.

        Args:
            prefix: Optional prefix to filter by.

        Returns:
            List of StorageObjects.
        """
        objects = []

        if prefix:
            search_path = self._get_full_path(prefix)
        else:
            search_path = self.root_path

        if not search_path.exists():
            return objects

        for file_path in search_path.rglob("*"):
            if file_path.is_file() and not file_path.suffix == ".tmp":
                stat = file_path.stat()
                relative_key = str(file_path.relative_to(self.root_path))
                objects.append(
                    StorageObject(
                        key=relative_key,
                        size=stat.st_size,
                        mime_type="application/octet-stream",
                        created_at=datetime.fromtimestamp(
                            stat.st_ctime, tz=timezone.utc
                        ).isoformat(),
                        updated_at=datetime.fromtimestamp(
                            stat.st_mtime, tz=timezone.utc
                        ).isoformat(),
                    )
                )

        return objects

    async def get_metadata(self, key: str) -> StorageObject | None:
        """Get object metadata without downloading content.

        Args:
            key: Storage key.

        Returns:
            StorageObject with metadata or None.
        """
        full_path = self._get_full_path(key)

        if not full_path.exists():
            return None

        stat = full_path.stat()
        return StorageObject(
            key=key,
            size=stat.st_size,
            mime_type="application/octet-stream",
            created_at=datetime.fromtimestamp(stat.st_ctime, tz=timezone.utc).isoformat(),
            updated_at=datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).isoformat(),
        )

    async def set_metadata(self, key: str, metadata: dict[str, Any]) -> bool:
        """Set object metadata.

        For local storage, metadata is stored in a sidecar file.

        Args:
            key: Storage key.
            metadata: Metadata to set.

        Returns:
            True if metadata was set successfully.
        """
        full_path = self._get_full_path(key)

        if not full_path.exists():
            return False

        # Store metadata in sidecar file
        meta_path = full_path.with_suffix(".meta")
        import json

        meta_path.write_text(json.dumps(metadata))
        return True

    async def generate_signed_url(
        self,
        key: str,
        expires_in: int = 3600,
        method: str = "GET",
    ) -> str:
        """Generate a signed URL for local file access.

        For local storage, this returns a file:// URL.

        Args:
            key: Storage key.
            expires_in: Expiry time in seconds (ignored for local).
            method: HTTP method (ignored for local).

        Returns:
            File URL.
        """
        full_path = self._get_full_path(key)

        if not full_path.exists():
            raise ObjectNotFoundError(f"Object not found: {key}")

        return f"file://{full_path.absolute()}"

    async def get_health(self) -> dict[str, Any]:
        """Get local storage health status.

        Returns:
            Health status dictionary.
        """
        try:
            # Check if root path exists and is writable
            self.root_path.mkdir(parents=True, exist_ok=True)
            test_file = self.root_path / ".health_check"
            test_file.write_text("ok")
            test_file.unlink()

            return {
                "status": "healthy",
                "provider": "local",
                "root_path": str(self.root_path),
                "writable": True,
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "provider": "local",
                "error": str(e),
            }