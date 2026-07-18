"""Media domain models."""

from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field


class AssetType(StrEnum):
    """Asset type enumeration."""

    IMAGE = "image"
    VIDEO = "video"
    PDF = "pdf"
    DOCUMENT = "document"
    AUDIO = "audio"
    ARCHIVE = "archive"
    SVG = "svg"
    UNKNOWN = "unknown"


class AssetStatus(StrEnum):
    """Asset status enumeration."""

    UPLOADING = "uploading"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"
    DELETED = "deleted"
    ARCHIVED = "archived"


class StorageProvider(StrEnum):
    """Storage provider enumeration."""

    LOCAL = "local"
    S3 = "s3"
    AZURE = "azure"
    R2 = "r2"
    MINIO = "minio"


class AssetMetadata(BaseModel):
    """Asset metadata model."""

    width: int | None = None
    height: int | None = None
    duration: int | None = None
    checksum: str | None = None
    exif: dict | None = None
    color_profile: str | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class Asset(BaseModel):
    """Asset model."""

    id: UUID
    filename: str
    original_filename: str
    content_type: str
    file_size: int
    asset_type: AssetType
    status: AssetStatus
    storage_provider: StorageProvider
    storage_path: str
    metadata: AssetMetadata | None = None
    folder_id: UUID | None = None
    created_by: UUID
    created_at: str
    updated_at: str | None = None
    deleted_at: str | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class AssetVersion(BaseModel):
    """Asset version model."""

    id: UUID
    asset_id: UUID
    version_number: int
    filename: str
    storage_path: str
    file_size: int
    checksum: str
    created_by: UUID
    created_at: str

    class Config:
        """Pydantic config."""

        frozen = True


class Folder(BaseModel):
    """Folder model."""

    id: UUID
    name: str
    parent_id: UUID | None = None
    path: str
    created_by: UUID
    created_at: str
    updated_at: str | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class Collection(BaseModel):
    """Collection model."""

    id: UUID
    name: str
    description: str | None = None
    is_smart: bool = False
    query: dict | None = None
    created_by: UUID
    created_at: str
    updated_at: str | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class AssetTag(BaseModel):
    """Asset tag model."""

    id: UUID
    name: str
    slug: str
    created_by: UUID
    created_at: str

    class Config:
        """Pydantic config."""

        frozen = True


class AssetRelation(BaseModel):
    """Asset relation model."""

    id: UUID
    source_asset_id: UUID
    target_asset_id: UUID
    relation_type: str
    created_by: UUID
    created_at: str

    class Config:
        """Pydantic config."""

        frozen = True


class Thumbnail(BaseModel):
    """Thumbnail model."""

    id: UUID
    asset_id: UUID
    size: str
    storage_path: str
    width: int
    height: int
    file_size: int
    created_at: str

    class Config:
        """Pydantic config."""

        frozen = True


class Transformation(BaseModel):
    """Transformation model."""

    id: UUID
    asset_id: UUID
    operation: str
    parameters: dict
    storage_path: str
    file_size: int
    created_by: UUID
    created_at: str

    class Config:
        """Pydantic config."""

        frozen = True


class UploadSession(BaseModel):
    """Upload session model."""

    id: UUID
    filename: str
    content_type: str
    file_size: int
    total_chunks: int
    uploaded_chunks: int = 0
    status: AssetStatus
    created_by: UUID
    created_at: str
    expires_at: str

    class Config:
        """Pydantic config."""

        frozen = True