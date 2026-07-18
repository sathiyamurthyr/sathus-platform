"""Azure Blob Storage provider implementation."""

import hashlib
from datetime import datetime, timezone
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


class AzureBlobStorageProvider(StorageProvider):
    """Azure Blob Storage provider implementation."""

    def __init__(
        self,
        account: str,
        key: str,
        container: str,
    ):
        """Initialize Azure Blob Storage provider.

        Args:
            account: Azure storage account name.
            key: Azure storage account key.
            container: Azure container name.
        """
        self.account = account
        self.key = key
        self.container = container
        self._blob_service_client = None

    def _get_blob_service_client(self):
        """Get or create Azure Blob Service Client."""
        if self._blob_service_client is None:
            from azure.storage.blob.aio import BlobServiceClient

            account_url = f"https://{self.account}.blob.core.windows.net"
            self._blob_service_client = BlobServiceClient(
                account_url=account_url,
                credential=self.key,
            )
        return self._blob_service_client

    def _calculate_checksum(self, data: bytes) -> str:
        """Calculate SHA256 checksum of data."""
        return hashlib.sha256(data).hexdigest()

    async def upload(
        self,
        key: str,
        data: bytes | AsyncIterator[bytes],
        mime_type: str,
        metadata: dict[str, Any] | None = None,
    ) -> StorageObject:
        """Upload data to Azure Blob Storage.

        Args:
            key: Storage key (blob name).
            data: File data or async iterator.
            mime_type: MIME type of the file.
            metadata: Optional metadata.

        Returns:
            StorageObject with metadata.

        Raises:
            UploadFailedError: If upload fails.
        """
        logger.info(f"Upload Started: key={key}, container={self.container}")

        try:
            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)
            blob_client = container_client.get_blob_client(key)

            # Handle async iterator
            if isinstance(data, AsyncIterator):
                content = b""
                async for chunk in data:
                    content += chunk
                data = content

            # Prepare metadata
            blob_metadata = {}
            if metadata:
                blob_metadata = {k: str(v) for k, v in metadata.items()}

            checksum = self._calculate_checksum(data)
            now = datetime.now(timezone.utc).isoformat()

            await blob_client.upload_blob(
                data,
                blob_type="BlockBlob",
                content_settings={"content_type": mime_type},
                metadata=blob_metadata,
            )

            logger.info(f"Upload Completed: key={key}, size={len(data)}")

            return StorageObject(
                key=key,
                size=len(data),
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
        """Download data from Azure Blob Storage.

        Args:
            key: Storage key (blob name).

        Returns:
            File content.

        Raises:
            DownloadFailedError: If download fails.
            ObjectNotFoundError: If object not found.
        """
        logger.info(f"Download Started: key={key}, container={self.container}")

        try:
            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)
            blob_client = container_client.get_blob_client(key)

            stream = await blob_client.download_blob()
            content = await stream.readall()

            logger.info(f"Download Completed: key={key}, size={len(content)}")
            return content
        except Exception as e:
            if "The specified blob does not exist" in str(e):
                raise ObjectNotFoundError(f"Object not found: {key}")
            logger.error(f"Download Failed: key={key}, error={e}")
            raise DownloadFailedError(f"Failed to download file: {e}") from e

    async def delete(self, key: str) -> bool:
        """Delete blob from Azure Blob Storage.

        Args:
            key: Storage key (blob name).

        Returns:
            True if deleted successfully.

        Raises:
            DeleteFailedError: If delete fails.
        """
        try:
            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)
            blob_client = container_client.get_blob_client(key)

            await blob_client.delete_blob()
            logger.info(f"Delete: key={key}")
            return True
        except Exception as e:
            logger.error(f"Delete Failed: key={key}, error={e}")
            raise DeleteFailedError(f"Failed to delete file: {e}") from e

    async def exists(self, key: str) -> bool:
        """Check if blob exists in Azure Blob Storage.

        Args:
            key: Storage key (blob name).

        Returns:
            True if blob exists.
        """
        try:
            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)
            blob_client = container_client.get_blob_client(key)

            return await blob_client.exists()
        except Exception:
            return False

    async def move(self, source_key: str, dest_key: str) -> bool:
        """Move blob within Azure Blob Storage.

        Args:
            source_key: Source storage key.
            dest_key: Destination storage key.

        Returns:
            True if moved successfully.
        """
        try:
            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)

            source_blob_client = container_client.get_blob_client(source_key)
            dest_blob_client = container_client.get_blob_client(dest_key)

            # Get source blob properties
            source_props = await source_blob_client.get_blob_properties()

            # Copy to destination
            await dest_blob_client.start_copy_from_url(
                source_blob_client.url,
            )

            # Delete source
            await source_blob_client.delete_blob()

            return True
        except Exception:
            return False

    async def copy(self, source_key: str, dest_key: str) -> bool:
        """Copy blob within Azure Blob Storage.

        Args:
            source_key: Source storage key.
            dest_key: Destination storage key.

        Returns:
            True if copied successfully.
        """
        try:
            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)

            source_blob_client = container_client.get_blob_client(source_key)
            dest_blob_client = container_client.get_blob_client(dest_key)

            await dest_blob_client.start_copy_from_url(
                source_blob_client.url,
            )

            return True
        except Exception:
            return False

    async def list(self, prefix: str | None = None) -> list[StorageObject]:
        """List blobs in Azure Blob Storage.

        Args:
            prefix: Optional prefix to filter by.

        Returns:
            List of StorageObjects.
        """
        objects = []

        try:
            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)

            async for blob in container_client.list_blobs(name_starts_with=prefix):
                objects.append(
                    StorageObject(
                        key=blob.name,
                        size=blob.size,
                        mime_type=blob.content_settings.content_type or "application/octet-stream",
                        created_at=blob.creation_time,
                        updated_at=blob.last_modified,
                    )
                )
        except Exception:
            pass

        return objects

    async def get_metadata(self, key: str) -> StorageObject | None:
        """Get blob metadata from Azure Blob Storage.

        Args:
            key: Storage key (blob name).

        Returns:
            StorageObject with metadata or None.
        """
        try:
            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)
            blob_client = container_client.get_blob_client(key)

            props = await blob_client.get_blob_properties()

            return StorageObject(
                key=key,
                size=props.size,
                mime_type=props.content_settings.content_type or "application/octet-stream",
                metadata=props.metadata,
                created_at=props.creation_time,
                updated_at=props.last_modified,
            )
        except Exception:
            return None

    async def set_metadata(self, key: str, metadata: dict[str, Any]) -> bool:
        """Set blob metadata in Azure Blob Storage.

        Args:
            key: Storage key (blob name).
            metadata: Metadata to set.

        Returns:
            True if metadata was set successfully.
        """
        try:
            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)
            blob_client = container_client.get_blob_client(key)

            blob_metadata = {k: str(v) for k, v in metadata.items()}
            await blob_client.set_blob_metadata(blob_metadata)

            return True
        except Exception:
            return False

    async def generate_signed_url(
        self,
        key: str,
        expires_in: int = 3600,
        method: str = "GET",
    ) -> str:
        """Generate a SAS URL for Azure Blob access.

        Args:
            key: Storage key (blob name).
            expires_in: Expiry time in seconds.
            method: HTTP method.

        Returns:
            SAS URL.

        Raises:
            SignedUrlGenerationError: If URL generation fails.
        """
        try:
            from azure.storage.blob import generate_blob_sas

            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)
            blob_client = container_client.get_blob_client(key)

            sas_token = generate_blob_sas(
                account_name=self.account,
                container_name=self.container,
                blob_name=key,
                account_key=self.key,
                permission="r" if method == "GET" else "w",
                expiry=datetime.now(timezone.utc).replace(
                    tzinfo=None
                ) + __import__("datetime").timedelta(seconds=expires_in),
            )

            return f"{blob_client.url}?{sas_token}"
        except Exception as e:
            logger.error(f"Signed URL Generation Failed: key={key}, error={e}")
            raise SignedUrlGenerationError(f"Failed to generate signed URL: {e}") from e

    async def get_health(self) -> dict[str, Any]:
        """Get Azure Blob Storage health status.

        Returns:
            Health status dictionary.
        """
        try:
            blob_service_client = self._get_blob_service_client()
            container_client = blob_service_client.get_container_client(self.container)

            # Check if container exists
            await container_client.get_container_properties()

            return {
                "status": "healthy",
                "provider": "azure",
                "account": self.account,
                "container": self.container,
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "provider": "azure",
                "account": self.account,
                "container": self.container,
                "error": str(e),
            }