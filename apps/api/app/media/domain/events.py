"""Media domain events."""

from uuid import UUID

from app.identity.domain.events import DomainEvent


class AssetUploaded(DomainEvent):
    """Event emitted when an asset is uploaded."""

    name: str = "asset.uploaded"
    asset_id: UUID
    filename: str
    asset_type: str
    file_size: int
    uploaded_by: UUID


class AssetDeleted(DomainEvent):
    """Event emitted when an asset is deleted."""

    name: str = "asset.deleted"
    asset_id: UUID
    filename: str
    deleted_by: UUID


class AssetRestored(DomainEvent):
    """Event emitted when an asset is restored."""

    name: str = "asset.restored"
    asset_id: UUID
    filename: str
    restored_by: UUID


class AssetMoved(DomainEvent):
    """Event emitted when an asset is moved to a different folder."""

    name: str = "asset.moved"
    asset_id: UUID
    from_folder_id: UUID | None
    to_folder_id: UUID | None
    moved_by: UUID


class AssetVersionCreated(DomainEvent):
    """Event emitted when a new asset version is created."""

    name: str = "asset.version.created"
    asset_id: UUID
    version_id: UUID
    version_number: int
    created_by: UUID
