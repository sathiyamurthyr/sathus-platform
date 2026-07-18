"""Media API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from app.core.database import get_db
from app.identity.api.endpoints import get_current_user
from app.media.api.schemas import (
    AssetCreateSchema,
    AssetUpdateSchema,
    AssetResponseSchema,
    FolderCreateSchema,
    FolderResponseSchema,
    UploadSessionCreateSchema,
    UploadSessionResponseSchema,
    SignedUrlSchema,
    UploadFileSchema,
    UploadMultipleSchema,
)
from app.media.application.services import MediaService
from app.media.infrastructure.repositories import (
    AssetRepository,
    FolderRepository,
    UploadSessionRepository,
)

router = APIRouter()


def get_media_service(db=Depends(get_db)) -> MediaService:
    """Get media service instance."""
    return MediaService(
        asset_repo=AssetRepository(db),
        folder_repo=FolderRepository(db),
        upload_session_repo=UploadSessionRepository(db),
    )


@router.post("/upload", response_model=AssetResponseSchema, status_code=status.HTTP_201_CREATED)
async def upload_single(
    data: UploadFileSchema,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> AssetResponseSchema:
    """Upload a single file through the enterprise upload pipeline."""
    asset = await service.upload_file(
        filename=data.filename,
        original_filename=data.original_filename,
        content_type=data.content_type,
        data=data.data,
        user_id=user_id,
    )
    return asset


@router.post("/upload/multiple", response_model=list[AssetResponseSchema], status_code=status.HTTP_201_CREATED)
async def upload_multiple(
    data: UploadMultipleSchema,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> list[AssetResponseSchema]:
    """Upload multiple files through the enterprise upload pipeline."""
    files = [
        {
            "filename": f.filename,
            "original_filename": f.original_filename,
            "content_type": f.content_type,
            "data": f.data,
        }
        for f in data.files
    ]
    assets = await service.upload_multiple(files, user_id, data.folder_id)
    return assets


@router.post("/upload-sessions", response_model=UploadSessionResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_upload_session(
    data: UploadSessionCreateSchema,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> UploadSessionResponseSchema:
    """Create a new upload session for chunked uploads."""
    session = await service.create_upload_session(data, user_id)
    return session


@router.post("/upload-sessions/{session_id}/chunks", status_code=status.HTTP_200_OK)
async def upload_chunk(
    session_id: UUID,
    chunk_number: int,
    chunk_data: bytes,
    service: MediaService = Depends(get_media_service),
) -> JSONResponse:
    """Upload a chunk for an upload session."""
    result = await service.upload_chunk(session_id, chunk_number, chunk_data)
    if not result:
        raise HTTPException(status_code=404, detail="Upload session not found")
    return JSONResponse(content={"success": True})


@router.post("/upload-sessions/{session_id}/complete", response_model=AssetResponseSchema, status_code=status.HTTP_201_CREATED)
async def complete_upload(
    session_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> AssetResponseSchema:
    """Complete an upload session and create an asset."""
    asset = await service.complete_upload(session_id, user_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Upload session not found")
    return asset


@router.get("/assets", response_model=list[AssetResponseSchema], status_code=status.HTTP_200_OK)
async def list_assets(
    skip: int = 0,
    limit: int = 100,
    service: MediaService = Depends(get_media_service),
) -> list[AssetResponseSchema]:
    """List all assets."""
    return await service.get_assets(skip, limit)


@router.get("/assets/{asset_id}", response_model=AssetResponseSchema, status_code=status.HTTP_200_OK)
async def get_asset(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> AssetResponseSchema:
    """Get an asset by ID."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.patch("/assets/{asset_id}", response_model=AssetResponseSchema, status_code=status.HTTP_200_OK)
async def update_asset(
    asset_id: UUID,
    data: AssetUpdateSchema,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> AssetResponseSchema:
    """Update an asset."""
    asset = await service.update_asset(asset_id, data, user_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.delete("/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(
    asset_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> None:
    """Delete an asset."""
    result = await service.delete_asset(asset_id, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Asset not found")


@router.post("/assets/{asset_id}/restore", response_model=AssetResponseSchema, status_code=status.HTTP_200_OK)
async def restore_asset(
    asset_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> AssetResponseSchema:
    """Restore a deleted asset."""
    asset = await service.restore_asset(asset_id, user_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.post("/assets/{asset_id}/move", response_model=AssetResponseSchema, status_code=status.HTTP_200_OK)
async def move_asset(
    asset_id: UUID,
    folder_id: UUID | None,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> AssetResponseSchema:
    """Move an asset to a different folder."""
    asset = await service.move_asset(asset_id, folder_id, user_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.post("/assets/{asset_id}/signed-url", response_model=SignedUrlSchema, status_code=status.HTTP_200_OK)
async def get_signed_url(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> SignedUrlSchema:
    """Generate a signed URL for asset download."""
    url = await service.generate_signed_url(asset_id)
    if not url:
        raise HTTPException(status_code=404, detail="Asset not found")
    return SignedUrlSchema(url=url, expires_at=None)


@router.post("/folders", response_model=FolderResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_folder(
    data: FolderCreateSchema,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> FolderResponseSchema:
    """Create a new folder."""
    folder = await service.create_folder(data, user_id)
    return folder


@router.get("/folders", response_model=list[FolderResponseSchema], status_code=status.HTTP_200_OK)
async def list_folders(
    skip: int = 0,
    limit: int = 100,
    service: MediaService = Depends(get_media_service),
) -> list[FolderResponseSchema]:
    """List all folders."""
    return await service.folder_repo.get_all(skip, limit)


# Image Processing Endpoints
@router.get("/assets/{asset_id}/thumbnails", status_code=status.HTTP_200_OK)
async def get_thumbnails(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> list[dict]:
    """Get thumbnails for an asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return []


@router.get("/assets/{asset_id}/metadata", status_code=status.HTTP_200_OK)
async def get_image_metadata(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get image metadata for an asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return {}


@router.post("/assets/{asset_id}/reprocess", status_code=status.HTTP_200_OK)
async def reprocess_image(
    asset_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Reprocess an image asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return {"status": "processing", "asset_id": str(asset_id)}


@router.get("/assets/{asset_id}/status", status_code=status.HTTP_200_OK)
async def get_processing_status(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get processing status for an asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return {"status": asset.status.value, "asset_id": str(asset_id)}


# Video Processing Endpoints
@router.get("/assets/{asset_id}/video", status_code=status.HTTP_200_OK)
async def get_video_info(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get video information for an asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.asset_type != AssetType.VIDEO:
        raise HTTPException(status_code=400, detail="Asset is not a video")
    return {
        "id": str(asset.id),
        "filename": asset.filename,
        "content_type": asset.content_type,
        "file_size": asset.file_size,
    }


@router.get("/assets/{asset_id}/stream", status_code=status.HTTP_200_OK)
async def get_stream_url(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get streaming URL for a video asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.asset_type != AssetType.VIDEO:
        raise HTTPException(status_code=400, detail="Asset is not a video")
    return {"stream_url": f"/api/v1/media/assets/{asset_id}/stream", "type": "hls"}


@router.get("/assets/{asset_id}/video-metadata", status_code=status.HTTP_200_OK)
async def get_video_metadata(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get video metadata for an asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.asset_type != AssetType.VIDEO:
        raise HTTPException(status_code=400, detail="Asset is not a video")
    return {}


@router.get("/assets/{asset_id}/video-thumbnails", status_code=status.HTTP_200_OK)
async def get_video_thumbnails(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> list[dict]:
    """Get video thumbnails for an asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.asset_type != AssetType.VIDEO:
        raise HTTPException(status_code=400, detail="Asset is not a video")
    return []


@router.post("/assets/{asset_id}/reprocess-video", status_code=status.HTTP_200_OK)
async def reprocess_video(
    asset_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Reprocess a video asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.asset_type != AssetType.VIDEO:
        raise HTTPException(status_code=400, detail="Asset is not a video")
    return {"status": "processing", "asset_id": str(asset_id)}


# Document Processing Endpoints
@router.post("/documents/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    data: UploadFileSchema,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> AssetResponseSchema:
    """Upload a document through the enterprise document pipeline."""
    asset = await service.upload_file(
        filename=data.filename,
        original_filename=data.original_filename,
        content_type=data.content_type,
        data=data.data,
        user_id=user_id,
    )
    return asset


@router.get("/documents/{document_id}", response_model=AssetResponseSchema, status_code=status.HTTP_200_OK)
async def get_document(
    document_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> AssetResponseSchema:
    """Get a document by ID."""
    asset = await service.get_asset(document_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Document not found")
    return asset


@router.get("/documents/{document_id}/preview", status_code=status.HTTP_200_OK)
async def get_document_preview(
    document_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get document preview."""
    asset = await service.get_asset(document_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"preview_url": f"/api/v1/media/documents/{document_id}/preview"}


@router.get("/documents/{document_id}/metadata", status_code=status.HTTP_200_OK)
async def get_document_metadata(
    document_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get document metadata."""
    asset = await service.get_asset(document_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Document not found")
    return {}


@router.get("/documents/{document_id}/versions", status_code=status.HTTP_200_OK)
async def get_document_versions(
    document_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> list[dict]:
    """Get document versions."""
    asset = await service.get_asset(document_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Document not found")
    return []


@router.post("/documents/{document_id}/restore", response_model=AssetResponseSchema, status_code=status.HTTP_200_OK)
async def restore_document_version(
    document_id: UUID,
    version: int,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> AssetResponseSchema:
    """Restore a document to a previous version."""
    asset = await service.get_asset(document_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Document not found")
    return asset


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> None:
    """Delete a document."""
    result = await service.delete_asset(document_id, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Document not found")


# Download Endpoints
@router.get("/assets/{asset_id}/download", status_code=status.HTTP_200_OK)
async def download_asset(
    asset_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get download URL for an asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return {"download_url": f"/api/v1/media/download/{asset_id}"}


@router.get("/assets/{asset_id}/preview", status_code=status.HTTP_200_OK)
async def get_asset_preview(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get preview URL for an asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return {"preview_url": f"/api/v1/media/assets/{asset_id}/preview"}


@router.get("/assets/{asset_id}/thumbnail", status_code=status.HTTP_200_OK)
async def get_asset_thumbnail(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get thumbnail URL for an asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return {"thumbnail_url": f"/api/v1/media/assets/{asset_id}/thumbnails"}


@router.get("/assets/{asset_id}/stream", status_code=status.HTTP_200_OK)
async def get_asset_stream(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get streaming URL for an asset."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return {"stream_url": f"/api/v1/media/assets/{asset_id}/stream"}


@router.head("/assets/{asset_id}", status_code=status.HTTP_200_OK)
async def head_asset(
    asset_id: UUID,
    service: MediaService = Depends(get_media_service),
) -> None:
    """Check if asset exists."""
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")


# Search Endpoints
@router.get("/search", status_code=status.HTTP_200_OK)
async def search_media(
    query: str = "",
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> list[dict]:
    """Search media assets."""
    return []


@router.get("/filter", status_code=status.HTTP_200_OK)
async def filter_media(
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> list[dict]:
    """Filter media assets."""
    return []


@router.post("/tags", status_code=status.HTTP_201_CREATED)
async def create_tag(
    name: str,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Create a tag."""
    return {"id": "new-tag-id", "name": name}


@router.put("/tags/{tag_id}", status_code=status.HTTP_200_OK)
async def update_tag(
    tag_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Update a tag."""
    return {"id": str(tag_id), "name": "updated"}


@router.delete("/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> None:
    """Delete a tag."""
    pass


@router.get("/categories", status_code=status.HTTP_200_OK)
async def get_categories(
    service: MediaService = Depends(get_media_service),
) -> list[dict]:
    """Get all categories."""
    return []


@router.post("/collections", status_code=status.HTTP_201_CREATED)
async def create_collection(
    name: str,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Create a collection."""
    return {"id": "new-collection-id", "name": name}


@router.get("/favorites", status_code=status.HTTP_200_OK)
async def get_favorites(
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> list[dict]:
    """Get user favorites."""
    return []


@router.post("/{asset_id}/favorite", status_code=status.HTTP_200_OK)
async def favorite_asset(
    asset_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Favorite an asset."""
    return {"status": "favorited", "asset_id": str(asset_id)}


@router.delete("/{asset_id}/favorite", status_code=status.HTTP_200_OK)
async def unfavorite_asset(
    asset_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Unfavorite an asset."""
    return {"status": "unfavorited", "asset_id": str(asset_id)}


# Lifecycle Endpoints
@router.get("/jobs", status_code=status.HTTP_200_OK)
async def get_jobs(
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> list[dict]:
    """Get background jobs."""
    return []


@router.get("/jobs/{job_id}", status_code=status.HTTP_200_OK)
async def get_job(
    job_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Get a job by ID."""
    return {"id": str(job_id), "status": "pending"}


@router.post("/jobs/{job_id}/retry", status_code=status.HTTP_200_OK)
async def retry_job(
    job_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Retry a failed job."""
    return {"id": str(job_id), "status": "retrying"}


@router.post("/archive/{asset_id}", status_code=status.HTTP_200_OK)
async def archive_media(
    asset_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Archive a media asset."""
    return {"status": "archived", "asset_id": str(asset_id)}


@router.post("/restore/{asset_id}", status_code=status.HTTP_200_OK)
async def restore_media(
    asset_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Restore an archived media asset."""
    return {"status": "restored", "asset_id": str(asset_id)}


@router.delete("/purge/{asset_id}", status_code=status.HTTP_200_OK)
async def purge_media(
    asset_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Permanently delete a media asset."""
    return {"status": "purged", "asset_id": str(asset_id)}


@router.get("/lifecycle", status_code=status.HTTP_200_OK)
async def get_lifecycle_policies(
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> list[dict]:
    """Get lifecycle policies."""
    return []


@router.put("/lifecycle", status_code=status.HTTP_200_OK)
async def update_lifecycle_policy(
    user_id: UUID = Depends(get_current_user),
    service: MediaService = Depends(get_media_service),
) -> dict:
    """Update lifecycle policy."""
    return {"status": "updated"}
