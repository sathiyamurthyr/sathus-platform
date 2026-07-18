"""Media API module."""

from app.media.api.endpoints import router
from app.media.api.schemas import (
    AssetCreateSchema,
    AssetUpdateSchema,
    AssetResponseSchema,
    FolderCreateSchema,
    FolderResponseSchema,
    UploadSessionCreateSchema,
    UploadSessionResponseSchema,
    SignedUrlSchema,
    AssetSearchSchema,
    CollectionCreateSchema,
    CollectionResponseSchema,
    AssetTagCreateSchema,
    AssetTagResponseSchema,
    AssetRelationCreateSchema,
    AssetRelationResponseSchema,
)

__all__ = [
    "router",
    "AssetCreateSchema",
    "AssetUpdateSchema",
    "AssetResponseSchema",
    "FolderCreateSchema",
    "FolderResponseSchema",
    "UploadSessionCreateSchema",
    "UploadSessionResponseSchema",
    "SignedUrlSchema",
    "AssetSearchSchema",
    "CollectionCreateSchema",
    "CollectionResponseSchema",
    "AssetTagCreateSchema",
    "AssetTagResponseSchema",
    "AssetRelationCreateSchema",
    "AssetRelationResponseSchema",
]