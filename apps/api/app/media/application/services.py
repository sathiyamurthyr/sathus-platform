"""Media application services."""

import hashlib
import os
from datetime import datetime, timedelta
from typing import Any
from uuid import UUID, uuid4

from app.core.logging import logger
from app.core.config import get_settings
from app.media.api.schemas import (
    AssetCreateSchema,
    AssetUpdateSchema,
    FolderCreateSchema,
    UploadSessionCreateSchema,
)
from app.media.domain.events import (
    AssetUploaded,
    AssetDeleted,
    AssetRestored,
    AssetMoved,
    AssetVersionCreated,
)
from app.media.domain.models import (
    Asset,
    AssetVersion,
    AssetMetadata,
    Folder,
    Collection,
    AssetTag,
    AssetRelation,
    Thumbnail,
    Transformation,
    UploadSession,
    AssetStatus,
    AssetType,
    StorageProvider,
)
from app.media.domain.upload_exceptions import (
    DuplicateFileError,
    StorageFailureError,
)
from app.media.infrastructure.repositories import (
    AssetRepository,
    FolderRepository,
    UploadSessionRepository,
)
from app.media.infrastructure.providers.factory import create_storage_provider
from app.media.application.validation import UploadValidator
from app.media.application.virus_scan import VirusScanService


class MediaService:
    """Media service for managing digital assets with upload pipeline."""

    def __init__(
        self,
        asset_repo: AssetRepository,
        folder_repo: FolderRepository,
        upload_session_repo: UploadSessionRepository,
        virus_scan_service: VirusScanService | None = None,
    ):
        """Initialize media service."""
        self.asset_repo = asset_repo
        self.folder_repo = folder_repo
        self.upload_session_repo = upload_session_repo
        self.validator = UploadValidator()
        self.virus_scan = virus_scan_service or VirusScanService()
        self.settings = get_settings()

    def _generate_object_key(self, original_filename: str) -> str:
        """Generate a secure object key for storage.

        Format: YYYY/MM/DD/{uuid}.{ext}

        Args:
            original_filename: Original filename from client.

        Returns:
            Secure object key.
        """
        now = datetime.now()
        date_path = now.strftime("%Y/%m/%d")
        _, ext = os.path.splitext(original_filename)
        return f"{date_path}/{uuid4()}{ext}"

    async def upload_file(
        self,
        filename: str,
        original_filename: str,
        content_type: str,
        data: bytes,
        user_id: UUID,
        folder_id: UUID | None = None,
    ) -> Asset:
        """Upload a single file through the complete pipeline.

        Pipeline:
        1. Validation
        2. Virus Scan Hook
        3. Storage Provider
        4. Metadata Persistence
        5. Audit Log
        6. Return Response

        Args:
            filename: Sanitized filename.
            original_filename: Original filename from client.
            content_type: MIME type of the file.
            data: File data.
            user_id: ID of the user uploading.
            folder_id: Optional folder ID.

        Returns:
            Created asset.

        Raises:
            UploadValidationError: If validation fails.
            StorageFailureError: If storage fails.
        """
        logger.info("upload_started", filename=original_filename, user_id=str(user_id))

        # Step 1: Validation
        validation_result = self.validator.validate(
            original_filename,
            content_type,
            len(data),
            data,
        )

        # Step 2: Virus Scan Hook
        scan_result = await self.virus_scan.scan(data, original_filename)
        if not scan_result.get("clean", True):
            logger.warning(
                "virus_scan_failed",
                filename=original_filename,
                threats=scan_result.get("threats", []),
            )
            raise StorageFailureError("Virus scan detected threats in file")

        # Step 3: Check for duplicates
        if self.settings.DUPLICATE_DETECTION_ENABLED and validation_result.get("checksum"):
            existing = await self.asset_repo.get_by_checksum(validation_result["checksum"])
            if existing:
                if self.settings.DUPLICATE_OVERWRITE:
                    logger.info("duplicate_overwrite", checksum=validation_result["checksum"])
                else:
                    raise DuplicateFileError(validation_result["checksum"])

        # Step 4: Storage Provider
        storage_provider = create_storage_provider()
        object_key = self._generate_object_key(original_filename)

        try:
            storage_object = await storage_provider.upload(
                key=object_key,
                data=data,
                mime_type=content_type,
                metadata={
                    "original_filename": original_filename,
                    "uploaded_by": str(user_id),
                },
            )
        except Exception as e:
            logger.error("storage_failed", error=str(e), filename=original_filename)
            raise StorageFailureError(f"Failed to store file: {e}")

        # Step 5: Metadata Persistence
        asset_type = self._get_asset_type(content_type)
        asset = Asset(
            id=uuid4(),
            filename=filename,
            original_filename=original_filename,
            content_type=content_type,
            file_size=len(data),
            asset_type=asset_type,
            status=AssetStatus.READY,
            storage_provider=StorageProvider(self.settings.MEDIA_STORAGE_PROVIDER),
            storage_path=object_key,
            metadata=AssetMetadata(checksum=validation_result.get("checksum")),
            folder_id=folder_id,
            created_by=user_id,
            created_at=datetime.now().isoformat(),
        )

        created_asset = await self.asset_repo.create(asset)

        # Step 6: Audit Log
        event = AssetUploaded(
            timestamp=datetime.now(),
            user_id=user_id,
            asset_id=created_asset.id,
            filename=created_asset.filename,
            asset_type=created_asset.asset_type.value,
            file_size=created_asset.file_size,
            uploaded_by=user_id,
        )
        logger.info(f"AssetUploaded: {event.model_dump_json()}")

        logger.info("upload_completed", asset_id=str(created_asset.id))

        return created_asset

    async def upload_multiple(
        self,
        files: list[dict[str, Any]],
        user_id: UUID,
        folder_id: UUID | None = None,
    ) -> list[Asset]:
        """Upload multiple files.

        Args:
            files: List of file data dicts with filename, content_type, data.
            user_id: ID of the user uploading.
            folder_id: Optional folder ID.

        Returns:
            List of created assets.
        """
        if len(files) > self.settings.MAX_FILES_PER_UPLOAD:
            raise StorageFailureError(
                f"Too many files: {len(files)} exceeds limit of {self.settings.MAX_FILES_PER_UPLOAD}"
            )

        assets = []
        for file_data in files:
            asset = await self.upload_file(
                filename=file_data["filename"],
                original_filename=file_data["original_filename"],
                content_type=file_data["content_type"],
                data=file_data["data"],
                user_id=user_id,
                folder_id=folder_id,
            )
            assets.append(asset)

        return assets

    async def create_upload_session(
        self,
        data: UploadSessionCreateSchema,
        user_id: UUID,
    ) -> UploadSession:
        """Create a new upload session."""
        session = UploadSession(
            id=uuid4(),
            filename=data.filename,
            content_type=data.content_type,
            file_size=data.file_size,
            total_chunks=data.total_chunks,
            uploaded_chunks=0,
            status=AssetStatus.UPLOADING,
            created_by=user_id,
            created_at=datetime.now().isoformat(),
            expires_at=(datetime.now() + timedelta(hours=24)).isoformat(),
        )
        return await self.upload_session_repo.create(session)

    async def upload_chunk(
        self,
        session_id: UUID,
        chunk_number: int,
        chunk_data: bytes,
    ) -> bool:
        """Upload a chunk for an upload session."""
        session = await self.upload_session_repo.get_by_id(session_id)
        if not session:
            return False

        # In a real implementation, this would save the chunk to storage
        # For now, we just update the chunk count
        await self.upload_session_repo.update_chunks(
            session_id, session.uploaded_chunks + 1
        )
        return True

    async def complete_upload(
        self,
        session_id: UUID,
        user_id: UUID,
    ) -> Asset | None:
        """Complete an upload session and create an asset."""
        session = await self.upload_session_repo.get_by_id(session_id)
        if not session:
            return None

        # Determine asset type from content type
        asset_type = self._get_asset_type(session.content_type)

        # Create asset
        asset = Asset(
            id=uuid4(),
            filename=session.filename,
            original_filename=session.filename,
            content_type=session.content_type,
            file_size=session.file_size,
            asset_type=asset_type,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path=f"media/{session.filename}",
            created_by=user_id,
            created_at=datetime.now().isoformat(),
        )

        created_asset = await self.asset_repo.create(asset)

        # Emit event
        event = AssetUploaded(
            timestamp=datetime.now(),
            user_id=user_id,
            asset_id=created_asset.id,
            filename=created_asset.filename,
            asset_type=created_asset.asset_type.value,
            file_size=created_asset.file_size,
            uploaded_by=user_id,
        )
        logger.info(f"AssetUploaded: {event.model_dump_json()}")

        return created_asset

    async def get_asset(self, asset_id: UUID) -> Asset | None:
        """Get an asset by ID."""
        return await self.asset_repo.get_by_id(asset_id)

    async def get_assets(self, skip: int = 0, limit: int = 100) -> list[Asset]:
        """Get all assets."""
        return await self.asset_repo.get_all(skip, limit)

    async def update_asset(
        self,
        asset_id: UUID,
        data: AssetUpdateSchema,
        user_id: UUID,
    ) -> Asset | None:
        """Update an asset."""
        # In a real implementation, this would update the asset
        return await self.asset_repo.get_by_id(asset_id)

    async def delete_asset(self, asset_id: UUID, user_id: UUID) -> bool:
        """Delete an asset."""
        asset = await self.asset_repo.get_by_id(asset_id)
        if not asset:
            return False

        result = await self.asset_repo.delete(asset_id)

        if result:
            event = AssetDeleted(
                timestamp=datetime.now(),
                user_id=user_id,
                asset_id=asset_id,
                filename=asset.filename,
                deleted_by=user_id,
            )
            logger.info(f"AssetDeleted: {event.model_dump_json()}")

        return result

    async def restore_asset(self, asset_id: UUID, user_id: UUID) -> Asset | None:
        """Restore a deleted asset."""
        asset = await self.asset_repo.restore(asset_id)

        if asset:
            event = AssetRestored(
                timestamp=datetime.now(),
                user_id=user_id,
                asset_id=asset_id,
                filename=asset.filename,
                restored_by=user_id,
            )
            logger.info(f"AssetRestored: {event.model_dump_json()}")

        return asset

    async def move_asset(
        self,
        asset_id: UUID,
        folder_id: UUID | None,
        user_id: UUID,
    ) -> Asset | None:
        """Move an asset to a different folder."""
        asset = await self.asset_repo.get_by_id(asset_id)
        if not asset:
            return None

        from_folder_id = asset.folder_id
        # In a real implementation, this would update the folder_id
        # For now, we just emit the event
        event = AssetMoved(
            timestamp=datetime.now(),
            user_id=user_id,
            asset_id=asset_id,
            from_folder_id=from_folder_id,
            to_folder_id=folder_id,
            moved_by=user_id,
        )
        logger.info(f"AssetMoved: {event.model_dump_json()}")

        return asset

    async def create_folder(
        self,
        data: FolderCreateSchema,
        user_id: UUID,
    ) -> Folder:
        """Create a new folder."""
        path = data.name
        if data.parent_id:
            parent = await self.folder_repo.get_by_id(data.parent_id)
            if parent:
                path = f"{parent.path}/{data.name}"

        folder = Folder(
            id=uuid4(),
            name=data.name,
            parent_id=data.parent_id,
            path=path,
            created_by=user_id,
            created_at=datetime.now().isoformat(),
        )

        return await self.folder_repo.create(folder)

    async def generate_signed_url(
        self,
        asset_id: UUID,
        expires_in: int = 3600,
    ) -> str | None:
        """Generate a signed URL for asset download."""
        asset = await self.asset_repo.get_by_id(asset_id)
        if not asset:
            return None

        storage_provider = create_storage_provider()
        return await storage_provider.generate_signed_url(asset.storage_path, expires_in)

    def _get_asset_type(self, content_type: str) -> AssetType:
        """Determine asset type from content type."""
        if content_type.startswith("image/"):
            if content_type == "image/svg+xml":
                return AssetType.SVG
            return AssetType.IMAGE
        elif content_type.startswith("video/"):
            return AssetType.VIDEO
        elif content_type == "application/pdf":
            return AssetType.PDF
        elif content_type in [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ]:
            return AssetType.DOCUMENT
        elif content_type.startswith("audio/"):
            return AssetType.AUDIO
        elif content_type in ["application/zip", "application/x-zip-compressed"]:
            return AssetType.ARCHIVE
        return AssetType.UNKNOWN

    def _calculate_checksum(self, data: bytes) -> str:
        """Calculate SHA256 checksum of data."""
        return hashlib.sha256(data).hexdigest()