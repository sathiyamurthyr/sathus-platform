"""Amazon S3 storage provider implementation."""

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


class S3StorageProvider(StorageProvider):
    """Amazon S3 storage provider implementation."""

    def __init__(
        self,
        access_key_id: str,
        secret_access_key: str,
        region: str,
        bucket: str,
    ):
        """Initialize S3 storage provider.

        Args:
            access_key_id: AWS access key ID.
            secret_access_key: AWS secret access key.
            region: AWS region.
            bucket: S3 bucket name.
        """
        self.access_key_id = access_key_id
        self.secret_access_key = secret_access_key
        self.region = region
        self.bucket = bucket
        self._client = None

    def _get_client(self):
        """Get or create S3 client."""
        if self._client is None:
            import aioboto3

            self._client = aioboto3.Session().client(
                "s3",
                aws_access_key_id=self.access_key_id,
                aws_secret_access_key=self.secret_access_key,
                region_name=self.region,
            )
        return self._client

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
        """Upload data to S3.

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
        logger.info(f"Upload Started: key={key}, bucket={self.bucket}")

        try:
            client = self._get_client()

            # Prepare S3 metadata
            s3_metadata = {}
            if metadata:
                s3_metadata = {k: str(v) for k, v in metadata.items()}

            # Handle async iterator
            if isinstance(data, AsyncIterator):
                # For streaming, we need to collect the data
                content = b""
                async for chunk in data:
                    content += chunk
                data = content

            checksum = self._calculate_checksum(data)
            now = datetime.now(timezone.utc).isoformat()

            async with client as s3:
                await s3.put_object(
                    Bucket=self.bucket,
                    Key=key,
                    Body=data,
                    ContentType=mime_type,
                    Metadata=s3_metadata,
                    ChecksumSHA256=checksum,
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
        """Download data from S3.

        Args:
            key: Storage key.

        Returns:
            File content.

        Raises:
            DownloadFailedError: If download fails.
            ObjectNotFoundError: If object not found.
        """
        logger.info(f"Download Started: key={key}, bucket={self.bucket}")

        try:
            client = self._get_client()

            async with client as s3:
                response = await s3.get_object(Bucket=self.bucket, Key=key)
                content = await response["Body"].read()

            logger.info(f"Download Completed: key={key}, size={len(content)}")
            return content
        except s3.exceptions.NoSuchKey:
            raise ObjectNotFoundError(f"Object not found: {key}")
        except Exception as e:
            logger.error(f"Download Failed: key={key}, error={e}")
            raise DownloadFailedError(f"Failed to download file: {e}") from e

    async def delete(self, key: str) -> bool:
        """Delete object from S3.

        Args:
            key: Storage key.

        Returns:
            True if deleted successfully.

        Raises:
            DeleteFailedError: If delete fails.
        """
        try:
            client = self._get_client()

            async with client as s3:
                await s3.delete_object(Bucket=self.bucket, Key=key)

            logger.info(f"Delete: key={key}")
            return True
        except Exception as e:
            logger.error(f"Delete Failed: key={key}, error={e}")
            raise DeleteFailedError(f"Failed to delete file: {e}") from e

    async def exists(self, key: str) -> bool:
        """Check if object exists in S3.

        Args:
            key: Storage key.

        Returns:
            True if object exists.
        """
        try:
            client = self._get_client()

            async with client as s3:
                await s3.head_object(Bucket=self.bucket, Key=key)
                return True
        except Exception:
            return False

    async def move(self, source_key: str, dest_key: str) -> bool:
        """Move object within S3.

        Args:
            source_key: Source storage key.
            dest_key: Destination storage key.

        Returns:
            True if moved successfully.
        """
        try:
            client = self._get_client()

            async with client as s3:
                # Copy to new location
                await s3.copy_object(
                    Bucket=self.bucket,
                    CopySource={"Bucket": self.bucket, "Key": source_key},
                    Key=dest_key,
                )
                # Delete original
                await s3.delete_object(Bucket=self.bucket, Key=source_key)

            return True
        except Exception:
            return False

    async def copy(self, source_key: str, dest_key: str) -> bool:
        """Copy object within S3.

        Args:
            source_key: Source storage key.
            dest_key: Destination storage key.

        Returns:
            True if copied successfully.
        """
        try:
            client = self._get_client()

            async with client as s3:
                await s3.copy_object(
                    Bucket=self.bucket,
                    CopySource={"Bucket": self.bucket, "Key": source_key},
                    Key=dest_key,
                )

            return True
        except Exception:
            return False

    async def list(self, prefix: str | None = None) -> list[StorageObject]:
        """List objects in S3.

        Args:
            prefix: Optional prefix to filter by.

        Returns:
            List of StorageObjects.
        """
        objects = []
        client = self._get_client()

        try:
            async with client as s3:
                paginator = s3.get_paginator("list_objects_v2")
                async for page in paginator.paginate(
                    Bucket=self.bucket, Prefix=prefix or ""
                ):
                    for obj in page.get("Contents", []):
                        objects.append(
                            StorageObject(
                                key=obj["Key"],
                                size=obj["Size"],
                                mime_type=obj.get("ContentType", "application/octet-stream"),
                                created_at=obj.get("LastModified"),
                                updated_at=obj.get("LastModified"),
                            )
                        )
        except Exception:
            pass

        return objects

    async def get_metadata(self, key: str) -> StorageObject | None:
        """Get object metadata from S3.

        Args:
            key: Storage key.

        Returns:
            StorageObject with metadata or None.
        """
        try:
            client = self._get_client()

            async with client as s3:
                response = await s3.head_object(Bucket=self.bucket, Key=key)

            return StorageObject(
                key=key,
                size=response["ContentLength"],
                mime_type=response.get("ContentType", "application/octet-stream"),
                metadata=response.get("Metadata"),
                created_at=response.get("LastModified"),
                updated_at=response.get("LastModified"),
            )
        except Exception:
            return None

    async def set_metadata(self, key: str, metadata: dict[str, Any]) -> bool:
        """Set object metadata in S3.

        Args:
            key: Storage key.
            metadata: Metadata to set.

        Returns:
            True if metadata was set successfully.
        """
        try:
            client = self._get_client()

            s3_metadata = {k: str(v) for k, v in metadata.items()}

            async with client as s3:
                # Get current object
                response = await s3.get_object(Bucket=self.bucket, Key=key)
                content = await response["Body"].read()

                # Re-upload with new metadata
                await s3.put_object(
                    Bucket=self.bucket,
                    Key=key,
                    Body=content,
                    Metadata=s3_metadata,
                    ContentType=response.get("ContentType", "application/octet-stream"),
                )

            return True
        except Exception:
            return False

    async def generate_signed_url(
        self,
        key: str,
        expires_in: int = 3600,
        method: str = "GET",
    ) -> str:
        """Generate a signed URL for S3 object access.

        Args:
            key: Storage key.
            expires_in: Expiry time in seconds.
            method: HTTP method.

        Returns:
            Signed URL.

        Raises:
            SignedUrlGenerationError: If URL generation fails.
        """
        try:
            client = self._get_client()

            async with client as s3:
                url = await s3.generate_presigned_url(
                    "get_object" if method == "GET" else "put_object",
                    Params={"Bucket": self.bucket, "Key": key},
                    ExpiresIn=expires_in,
                )

            return url
        except Exception as e:
            logger.error(f"Signed URL Generation Failed: key={key}, error={e}")
            raise SignedUrlGenerationError(f"Failed to generate signed URL: {e}") from e

    async def get_health(self) -> dict[str, Any]:
        """Get S3 storage health status.

        Returns:
            Health status dictionary.
        """
        try:
            client = self._get_client()

            async with client as s3:
                # Check if bucket exists and is accessible
                await s3.head_bucket(Bucket=self.bucket)

            return {
                "status": "healthy",
                "provider": "s3",
                "bucket": self.bucket,
                "region": self.region,
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "provider": "s3",
                "bucket": self.bucket,
                "error": str(e),
            }