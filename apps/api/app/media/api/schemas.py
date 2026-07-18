"""Media API schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.media.domain.models import AssetType, AssetStatus, StorageProvider


class AssetMetadataSchema(BaseModel):
    """Asset metadata schema."""

    width: int | None = None
    height: int | None = None
    duration: int | None = None
    checksum: str | None = None


class AssetCreateSchema(BaseModel):
    """Schema for creating an asset."""

    filename: str = Field(..., max_length=255)
    original_filename: str = Field(..., max_length=255)
    content_type: str = Field(..., max_length=100)
    file_size: int = Field(..., gt=0)
    asset_type: AssetType
    folder_id: UUID | None = None


class AssetUpdateSchema(BaseModel):
    """Schema for updating an asset."""

    filename: str | None = Field(None, max_length=255)
    folder_id: UUID | None = None


class UploadFileSchema(BaseModel):
    """Schema for single file upload."""

    filename: str = Field(..., max_length=255)
    original_filename: str = Field(..., max_length=255)
    content_type: str = Field(..., max_length=100)
    data: bytes


class UploadMultipleSchema(BaseModel):
    """Schema for multiple file upload."""

    files: list[UploadFileSchema] = Field(..., min_length=1)
    folder_id: UUID | None = None


class AssetResponseSchema(BaseModel):
    """Schema for asset response."""

    id: UUID
    filename: str
    original_filename: str
    content_type: str
    file_size: int
    asset_type: AssetType
    status: AssetStatus
    storage_provider: StorageProvider
    storage_path: str
    metadata: AssetMetadataSchema | None = None
    folder_id: UUID | None = None
    created_by: UUID
    created_at: datetime
    updated_at: datetime | None = None
    deleted_at: datetime | None = None


class FolderCreateSchema(BaseModel):
    """Schema for creating a folder."""

    name: str = Field(..., max_length=255)
    parent_id: UUID | None = None


class FolderResponseSchema(BaseModel):
    """Schema for folder response."""

    id: UUID
    name: str
    parent_id: UUID | None = None
    path: str
    created_by: UUID
    created_at: datetime
    updated_at: datetime | None = None


class UploadSessionCreateSchema(BaseModel):
    """Schema for creating an upload session."""

    filename: str = Field(..., max_length=255)
    content_type: str = Field(..., max_length=100)
    file_size: int = Field(..., gt=0)
    total_chunks: int = Field(..., gt=0)


class UploadSessionResponseSchema(BaseModel):
    """Schema for upload session response."""

    id: UUID
    filename: str
    content_type: str
    file_size: int
    total_chunks: int
    uploaded_chunks: int
    status: AssetStatus
    created_by: UUID
    created_at: datetime
    expires_at: datetime


class UploadChunkSchema(BaseModel):
    """Schema for uploading a chunk."""

    session_id: UUID
    chunk_number: int = Field(..., ge=0)
    chunk_data: bytes


class SignedUrlSchema(BaseModel):
    """Schema for signed URL response."""

    url: str
    expires_at: datetime


class AssetSearchSchema(BaseModel):
    """Schema for asset search parameters."""

    query: str | None = None
    asset_type: AssetType | None = None
    folder_id: UUID | None = None
    tag_id: UUID | None = None
    created_by: UUID | None = None
    created_after: datetime | None = None
    created_before: datetime | None = None
    skip: int = Field(default=0, ge=0)
    limit: int = Field(default=100, gt=0, le=100)


class CollectionCreateSchema(BaseModel):
    """Schema for creating a collection."""

    name: str = Field(..., max_length=255)
    description: str | None = None
    is_smart: bool = False
    query: dict | None = None


class CollectionResponseSchema(BaseModel):
    """Schema for collection response."""

    id: UUID
    name: str
    description: str | None = None
    is_smart: bool
    query: dict | None = None
    created_by: UUID
    created_at: datetime
    updated_at: datetime | None = None


class AssetTagCreateSchema(BaseModel):
    """Schema for creating an asset tag."""

    name: str = Field(..., max_length=100)


class AssetTagResponseSchema(BaseModel):
    """Schema for asset tag response."""

    id: UUID
    name: str
    slug: str
    created_by: UUID
    created_at: datetime


class AssetRelationCreateSchema(BaseModel):
    """Schema for creating an asset relation."""

    target_asset_id: UUID
    relation_type: str = Field(..., max_length=50)


class AssetRelationResponseSchema(BaseModel):
    """Schema for asset relation response."""

    id: UUID
    source_asset_id: UUID
    target_asset_id: UUID
    relation_type: str
    created_by: UUID
    created_at: datetime