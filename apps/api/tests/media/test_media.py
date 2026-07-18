"""Media module tests."""

import pytest
from uuid import uuid4

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
    AssetType,
    AssetStatus,
    StorageProvider,
)
from app.media.domain.events import (
    AssetUploaded,
    AssetDeleted,
    AssetRestored,
    AssetMoved,
    AssetVersionCreated,
)


class TestAssetModels:
    """Tests for Asset domain models."""

    def test_asset_type_enum(self):
        """Test AssetType enum values."""
        assert AssetType.IMAGE == "image"
        assert AssetType.VIDEO == "video"
        assert AssetType.PDF == "pdf"
        assert AssetType.DOCUMENT == "document"
        assert AssetType.AUDIO == "audio"
        assert AssetType.ARCHIVE == "archive"
        assert AssetType.SVG == "svg"
        assert AssetType.UNKNOWN == "unknown"

    def test_asset_status_enum(self):
        """Test AssetStatus enum values."""
        assert AssetStatus.UPLOADING == "uploading"
        assert AssetStatus.PROCESSING == "processing"
        assert AssetStatus.READY == "ready"
        assert AssetStatus.FAILED == "failed"
        assert AssetStatus.DELETED == "deleted"
        assert AssetStatus.ARCHIVED == "archived"

    def test_storage_provider_enum(self):
        """Test StorageProvider enum values."""
        assert StorageProvider.LOCAL == "local"
        assert StorageProvider.S3 == "s3"
        assert StorageProvider.AZURE == "azure"
        assert StorageProvider.R2 == "r2"
        assert StorageProvider.MINIO == "minio"

    def test_asset_metadata_creation(self):
        """Test AssetMetadata model creation."""
        metadata = AssetMetadata(
            width=1920,
            height=1080,
            duration=120,
            checksum="abc123",
        )
        assert metadata.width == 1920
        assert metadata.height == 1080
        assert metadata.duration == 120
        assert metadata.checksum == "abc123"

    def test_asset_creation(self):
        """Test Asset model creation."""
        asset_id = uuid4()
        user_id = uuid4()
        metadata = AssetMetadata(width=1920, height=1080)

        asset = Asset(
            id=asset_id,
            filename="test-image.png",
            original_filename="original.png",
            content_type="image/png",
            file_size=1024000,
            asset_type=AssetType.IMAGE,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="/media/test-image.png",
            metadata=metadata,
            created_by=user_id,
            created_at="2025-01-01T00:00:00",
        )

        assert asset.id == asset_id
        assert asset.filename == "test-image.png"
        assert asset.asset_type == AssetType.IMAGE
        assert asset.status == AssetStatus.READY
        assert asset.metadata.width == 1920

    def test_asset_version_creation(self):
        """Test AssetVersion model creation."""
        version_id = uuid4()
        asset_id = uuid4()
        user_id = uuid4()

        version = AssetVersion(
            id=version_id,
            asset_id=asset_id,
            version_number=1,
            filename="test-image-v1.png",
            storage_path="/media/test-image-v1.png",
            file_size=1024000,
            checksum="abc123",
            created_by=user_id,
            created_at="2025-01-01T00:00:00",
        )

        assert version.version_number == 1
        assert version.checksum == "abc123"

    def test_folder_creation(self):
        """Test Folder model creation."""
        folder_id = uuid4()
        user_id = uuid4()

        folder = Folder(
            id=folder_id,
            name="Images",
            path="/Images",
            created_by=user_id,
            created_at="2025-01-01T00:00:00",
        )

        assert folder.name == "Images"
        assert folder.path == "/Images"

    def test_collection_creation(self):
        """Test Collection model creation."""
        collection_id = uuid4()
        user_id = uuid4()

        collection = Collection(
            id=collection_id,
            name="Featured Images",
            is_smart=False,
            created_by=user_id,
            created_at="2025-01-01T00:00:00",
        )

        assert collection.name == "Featured Images"
        assert collection.is_smart is False

    def test_upload_session_creation(self):
        """Test UploadSession model creation."""
        session_id = uuid4()
        user_id = uuid4()

        session = UploadSession(
            id=session_id,
            filename="large-file.zip",
            content_type="application/zip",
            file_size=50000000,
            total_chunks=100,
            uploaded_chunks=0,
            status=AssetStatus.UPLOADING,
            created_by=user_id,
            created_at="2025-01-01T00:00:00",
            expires_at="2025-01-02T00:00:00",
        )

        assert session.total_chunks == 100
        assert session.uploaded_chunks == 0


class TestAssetEvents:
    """Tests for Asset domain events."""

    def test_asset_uploaded_event(self):
        """Test AssetUploaded event creation."""
        asset_id = uuid4()
        user_id = uuid4()

        event = AssetUploaded(
            asset_id=asset_id,
            filename="test.png",
            asset_type="image",
            file_size=1024,
            uploaded_by=user_id,
            timestamp="2025-01-01T00:00:00",
            user_id=user_id,
        )

        assert event.name == "asset.uploaded"
        assert event.asset_id == asset_id
        assert event.filename == "test.png"

    def test_asset_deleted_event(self):
        """Test AssetDeleted event creation."""
        asset_id = uuid4()
        user_id = uuid4()

        event = AssetDeleted(
            asset_id=asset_id,
            filename="test.png",
            deleted_by=user_id,
            timestamp="2025-01-01T00:00:00",
            user_id=user_id,
        )

        assert event.name == "asset.deleted"

    def test_asset_restored_event(self):
        """Test AssetRestored event creation."""
        asset_id = uuid4()
        user_id = uuid4()

        event = AssetRestored(
            asset_id=asset_id,
            filename="test.png",
            restored_by=user_id,
            timestamp="2025-01-01T00:00:00",
            user_id=user_id,
        )

        assert event.name == "asset.restored"

    def test_asset_moved_event(self):
        """Test AssetMoved event creation."""
        asset_id = uuid4()
        user_id = uuid4()

        event = AssetMoved(
            asset_id=asset_id,
            from_folder_id=uuid4(),
            to_folder_id=uuid4(),
            moved_by=user_id,
            timestamp="2025-01-01T00:00:00",
            user_id=user_id,
        )

        assert event.name == "asset.moved"

    def test_asset_version_created_event(self):
        """Test AssetVersionCreated event creation."""
        asset_id = uuid4()
        version_id = uuid4()
        user_id = uuid4()

        event = AssetVersionCreated(
            asset_id=asset_id,
            version_id=version_id,
            version_number=1,
            created_by=user_id,
            timestamp="2025-01-01T00:00:00",
            user_id=user_id,
        )

        assert event.name == "asset.version.created"
