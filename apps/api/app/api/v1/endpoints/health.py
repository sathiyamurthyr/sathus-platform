"""Health check endpoint."""

from typing import Any

from fastapi import APIRouter

from app.media.infrastructure.providers.factory import create_storage_provider

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok"}


@router.get("/health/storage")
async def storage_health_check() -> dict[str, Any]:
    """Storage provider health check endpoint."""
    provider = create_storage_provider()
    return await provider.get_health()


@router.get("/health/storage/{provider_name}")
async def specific_storage_health_check(provider_name: str) -> dict[str, Any]:
    """Specific storage provider health check endpoint.

    Args:
        provider_name: Name of the storage provider (local, s3, azure, minio).
    """
    from app.core.config import get_settings

    settings = get_settings()

    # Temporarily override provider for health check
    original_provider = settings.MEDIA_STORAGE_PROVIDER

    # Create provider based on name
    if provider_name == "local":
        from app.media.infrastructure.providers.local import LocalStorageProvider

        provider = LocalStorageProvider(root_path=settings.MEDIA_ROOT)
    elif provider_name == "s3":
        if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY:
            return {
                "status": "unhealthy",
                "provider": "s3",
                "error": "AWS credentials not configured",
            }
        from app.media.infrastructure.providers.s3 import S3StorageProvider

        provider = S3StorageProvider(
            access_key_id=settings.AWS_ACCESS_KEY_ID,
            secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region=settings.AWS_REGION,
            bucket=settings.AWS_BUCKET or "",
        )
    elif provider_name == "azure":
        if not settings.AZURE_STORAGE_ACCOUNT or not settings.AZURE_STORAGE_KEY:
            return {
                "status": "unhealthy",
                "provider": "azure",
                "error": "Azure credentials not configured",
            }
        from app.media.infrastructure.providers.azure import AzureBlobStorageProvider

        provider = AzureBlobStorageProvider(
            account=settings.AZURE_STORAGE_ACCOUNT,
            key=settings.AZURE_STORAGE_KEY,
            container=settings.AZURE_CONTAINER or "",
        )
    elif provider_name == "minio":
        if not settings.MINIO_ENDPOINT or not settings.MINIO_ACCESS_KEY:
            return {
                "status": "unhealthy",
                "provider": "minio",
                "error": "MinIO credentials not configured",
            }
        from app.media.infrastructure.providers.minio import MinIOStorageProvider

        provider = MinIOStorageProvider(
            endpoint=settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY or "",
            bucket=settings.MINIO_BUCKET or "",
        )
    else:
        return {
            "status": "unhealthy",
            "provider": provider_name,
            "error": f"Unknown provider: {provider_name}",
        }

    return await provider.get_health()
