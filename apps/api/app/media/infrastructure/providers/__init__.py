"""Storage providers package."""

from app.media.infrastructure.providers.azure import AzureBlobStorageProvider
from app.media.infrastructure.providers.factory import create_storage_provider, get_storage_provider
from app.media.infrastructure.providers.local import LocalStorageProvider
from app.media.infrastructure.providers.minio import MinIOStorageProvider
from app.media.infrastructure.providers.s3 import S3StorageProvider

__all__ = [
    "LocalStorageProvider",
    "S3StorageProvider",
    "AzureBlobStorageProvider",
    "MinIOStorageProvider",
    "create_storage_provider",
    "get_storage_provider",
]