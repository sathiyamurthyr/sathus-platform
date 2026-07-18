"""Media infrastructure repositories."""

from uuid import UUID

from sqlalchemy import select, update, delete, and_, func
from sqlalchemy.ext.asyncio import AsyncSession

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
)
from app.media.infrastructure.models import (
    Asset as AssetModel,
    AssetVersion as AssetVersionModel,
    Folder as FolderModel,
    Collection as CollectionModel,
    AssetTag as AssetTagModel,
    AssetRelation as AssetRelationModel,
    Thumbnail as ThumbnailModel,
    Transformation as TransformationModel,
    UploadSession as UploadSessionModel,
)


class AssetRepository:
    """Repository for Asset entity."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(self, asset: Asset) -> Asset:
        """Create a new asset."""
        db_asset = AssetModel(
            id=asset.id,
            filename=asset.filename,
            original_filename=asset.original_filename,
            content_type=asset.content_type,
            file_size=asset.file_size,
            asset_type=asset.asset_type,
            status=asset.status,
            storage_provider=asset.storage_provider,
            storage_path=asset.storage_path,
            metadata_width=asset.metadata.width if asset.metadata else None,
            metadata_height=asset.metadata.height if asset.metadata else None,
            metadata_duration=asset.metadata.duration if asset.metadata else None,
            metadata_checksum=asset.metadata.checksum if asset.metadata else None,
            folder_id=asset.folder_id,
            created_by=asset.created_by,
        )
        self.session.add(db_asset)
        await self.session.commit()
        return asset

    async def get_by_id(self, asset_id: UUID) -> Asset | None:
        """Get asset by ID."""
        result = await self.session.execute(
            select(AssetModel).where(
                and_(AssetModel.id == asset_id, AssetModel.deleted_at.is_(None))
            )
        )
        db_asset = result.scalar_one_or_none()
        if not db_asset:
            return None
        return self._to_domain(db_asset)

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Asset]:
        """Get all assets."""
        result = await self.session.execute(
            select(AssetModel)
            .where(AssetModel.deleted_at.is_(None))
            .offset(skip)
            .limit(limit)
        )
        return [self._to_domain(db_asset) for db_asset in result.scalars().all()]

    async def get_by_checksum(self, checksum: str) -> Asset | None:
        """Get asset by checksum for duplicate detection."""
        result = await self.session.execute(
            select(AssetModel).where(
                and_(
                    AssetModel.metadata_checksum == checksum,
                    AssetModel.deleted_at.is_(None),
                )
            )
        )
        db_asset = result.scalar_one_or_none()
        if not db_asset:
            return None
        return self._to_domain(db_asset)

    async def update_status(self, asset_id: UUID, status: AssetStatus) -> Asset | None:
        """Update asset status."""
        result = await self.session.execute(
            update(AssetModel)
            .where(AssetModel.id == asset_id)
            .values(status=status)
            .returning(AssetModel)
        )
        await self.session.commit()
        db_asset = result.scalar_one_or_none()
        if not db_asset:
            return None
        return self._to_domain(db_asset)

    async def delete(self, asset_id: UUID) -> bool:
        """Soft delete an asset."""
        result = await self.session.execute(
            update(AssetModel)
            .where(AssetModel.id == asset_id)
            .values(deleted_at=func.now(), status=AssetStatus.DELETED)
        )
        await self.session.commit()
        return result.rowcount > 0

    async def restore(self, asset_id: UUID) -> Asset | None:
        """Restore a deleted asset."""
        result = await self.session.execute(
            update(AssetModel)
            .where(AssetModel.id == asset_id)
            .values(deleted_at=None, status=AssetStatus.READY)
            .returning(AssetModel)
        )
        await self.session.commit()
        db_asset = result.scalar_one_or_none()
        if not db_asset:
            return None
        return self._to_domain(db_asset)

    def _to_domain(self, db_asset: AssetModel) -> Asset:
        """Convert database model to domain model."""
        metadata = None
        if any([db_asset.metadata_width, db_asset.metadata_height, db_asset.metadata_duration]):
            metadata = AssetMetadata(
                width=db_asset.metadata_width,
                height=db_asset.metadata_height,
                duration=db_asset.metadata_duration,
                checksum=db_asset.metadata_checksum,
            )
        return Asset(
            id=db_asset.id,
            filename=db_asset.filename,
            original_filename=db_asset.original_filename,
            content_type=db_asset.content_type,
            file_size=db_asset.file_size,
            asset_type=db_asset.asset_type,
            status=db_asset.status,
            storage_provider=db_asset.storage_provider,
            storage_path=db_asset.storage_path,
            metadata=metadata,
            folder_id=db_asset.folder_id,
            created_by=db_asset.created_by,
            created_at=db_asset.created_at.isoformat(),
            updated_at=db_asset.updated_at.isoformat() if db_asset.updated_at else None,
            deleted_at=db_asset.deleted_at.isoformat() if db_asset.deleted_at else None,
        )


class FolderRepository:
    """Repository for Folder entity."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(self, folder: Folder) -> Folder:
        """Create a new folder."""
        db_folder = FolderModel(
            id=folder.id,
            name=folder.name,
            parent_id=folder.parent_id,
            path=folder.path,
            created_by=folder.created_by,
        )
        self.session.add(db_folder)
        await self.session.commit()
        return folder

    async def get_by_id(self, folder_id: UUID) -> Folder | None:
        """Get folder by ID."""
        result = await self.session.execute(select(FolderModel).where(FolderModel.id == folder_id))
        db_folder = result.scalar_one_or_none()
        if not db_folder:
            return None
        return self._to_domain(db_folder)

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Folder]:
        """Get all folders."""
        result = await self.session.execute(select(FolderModel).offset(skip).limit(limit))
        return [self._to_domain(db_folder) for db_folder in result.scalars().all()]

    def _to_domain(self, db_folder: FolderModel) -> Folder:
        """Convert database model to domain model."""
        return Folder(
            id=db_folder.id,
            name=db_folder.name,
            parent_id=db_folder.parent_id,
            path=db_folder.path,
            created_by=db_folder.created_by,
            created_at=db_folder.created_at.isoformat(),
            updated_at=db_folder.updated_at.isoformat() if db_folder.updated_at else None,
        )


class UploadSessionRepository:
    """Repository for UploadSession entity."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(self, session_data: UploadSession) -> UploadSession:
        """Create a new upload session."""
        db_session = UploadSessionModel(
            id=session_data.id,
            filename=session_data.filename,
            content_type=session_data.content_type,
            file_size=session_data.file_size,
            total_chunks=session_data.total_chunks,
            created_by=session_data.created_by,
            expires_at=session_data.expires_at,
        )
        self.session.add(db_session)
        await self.session.commit()
        return session_data

    async def get_by_id(self, session_id: UUID) -> UploadSession | None:
        """Get upload session by ID."""
        result = await self.session.execute(
            select(UploadSessionModel).where(UploadSessionModel.id == session_id)
        )
        db_session = result.scalar_one_or_none()
        if not db_session:
            return None
        return self._to_domain(db_session)

    async def update_chunks(self, session_id: UUID, uploaded_chunks: int) -> UploadSession | None:
        """Update uploaded chunks count."""
        result = await self.session.execute(
            update(UploadSessionModel)
            .where(UploadSessionModel.id == session_id)
            .values(uploaded_chunks=uploaded_chunks)
            .returning(UploadSessionModel)
        )
        await self.session.commit()
        db_session = result.scalar_one_or_none()
        if not db_session:
            return None
        return self._to_domain(db_session)

    def _to_domain(self, db_session: UploadSessionModel) -> UploadSession:
        """Convert database model to domain model."""
        return UploadSession(
            id=db_session.id,
            filename=db_session.filename,
            content_type=db_session.content_type,
            file_size=db_session.file_size,
            total_chunks=db_session.total_chunks,
            uploaded_chunks=db_session.uploaded_chunks,
            status=db_session.status,
            created_by=db_session.created_by,
            created_at=db_session.created_at.isoformat(),
            expires_at=db_session.expires_at.isoformat(),
        )