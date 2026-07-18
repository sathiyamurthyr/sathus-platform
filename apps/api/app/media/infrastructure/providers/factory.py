"""Storage provider factory for creating configured providers."""

from typing import Any

from app.core.config import get_settings
from app.media.domain.storage import StorageProvider
from app.media.infrastructure.providers.azure import AzureBlobStorageProvider
from app.media.infrastructure.providers.local import LocalStorageProvider
from app.media.infrastructure.providers.minio import MinIOStorageProvider
from app.media.infrastructure.providers.s3 import S3StorageProvider


def create_storage_provider() -> StorageProvider:
    """Create a storage provider based on configuration.

    Returns:
        Configured storage provider instance.

    Raises:
        ValueError: If required configuration is missing.
    """
    settings = get_settings()
    provider_type = settings.MEDIA_STORAGE_PROVIDER

    if provider_type == "local":
        return LocalStorageProvider(root_path=settings.MEDIA_ROOT)

    if provider_type == "s3":
        if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY:
            raise ValueError("AWS credentials are required for S3 provider")
        if not settings.AWS_BUCKET:
            raise ValueError("AWS_BUCKET is required for S3 provider")

        return S3StorageProvider(
            access_key_id=settings.AWS_ACCESS_KEY_ID,
            secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region=settings.AWS_REGION,
            bucket=settings.AWS_BUCKET,
        )

    if provider_type == "azure":
        if not settings.AZURE_STORAGE_ACCOUNT or not settings.AZURE_STORAGE_KEY:
            raise ValueError("Azure credentials are required for Azure provider")
        if not settings.AZURE_CONTAINER:
            raise ValueError("AZURE_CONTAINER is required for Azure provider")

        return AzureBlobStorageProvider(
            account=settings.AZURE_STORAGE_ACCOUNT,
            key=settings.AZURE_STORAGE_KEY,
            container=settings.AZURE_CONTAINER,
        )

    if provider_type == "minio":
        if not settings.MINIO_ENDPOINT or not settings.MINIO_ACCESS_KEY:
            raise ValueError("MinIO credentials are required for MinIO provider")
        if not settings.MINIO_BUCKET:
            raise ValueError("MINIO_BUCKET is required for MinIO provider")

        return MinIOStorageProvider(
            endpoint=settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY or "",
            bucket=settings.MINIO_BUCKET,
        )

    raise ValueError(f"Unknown storage provider: {provider_type}")


async def get_storage_provider() -> StorageProvider:
    """Get storage provider for dependency injection.

    Returns:
        Storage provider instance.
    """
    return create_storage_provider()