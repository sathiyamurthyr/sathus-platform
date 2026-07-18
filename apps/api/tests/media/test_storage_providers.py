"""Tests for storage providers."""

import pytest
import tempfile
from pathlib import Path

from app.media.domain.storage import StorageObject, StorageProvider
from app.media.infrastructure.providers.local import LocalStorageProvider
from app.media.infrastructure.providers.factory import create_storage_provider
from app.media.domain.exceptions import (
    UploadFailedError,
    DownloadFailedError,
    ObjectNotFoundError,
    DeleteFailedError,
)


class TestLocalStorageProvider:
    """Tests for Local Storage Provider."""

    @pytest.fixture
    def temp_storage(self):
        """Create temporary storage for tests."""
        with tempfile.TemporaryDirectory() as tmpdir:
            yield LocalStorageProvider(root_path=tmpdir)

    @pytest.mark.asyncio
    async def test_upload_and_download(self, temp_storage):
        """Test upload and download operations."""
        key = "test/file.txt"
        data = b"Hello, World!"
        mime_type = "text/plain"

        # Upload
        result = await temp_storage.upload(key, data, mime_type)

        assert result.key == key
        assert result.size == len(data)
        assert result.mime_type == mime_type
        assert result.checksum is not None

        # Download
        downloaded = await temp_storage.download(key)
        assert downloaded == data

    @pytest.mark.asyncio
    async def test_exists(self, temp_storage):
        """Test exists operation."""
        key = "test/exists.txt"
        data = b"Test data"

        # Should not exist initially
        assert await temp_storage.exists(key) is False

        # Upload and check
        await temp_storage.upload(key, data, "text/plain")
        assert await temp_storage.exists(key) is True

    @pytest.mark.asyncio
    async def test_delete(self, temp_storage):
        """Test delete operation."""
        key = "test/delete.txt"
        data = b"Test data"

        # Upload and delete
        await temp_storage.upload(key, data, "text/plain")
        assert await temp_storage.exists(key) is True

        result = await temp_storage.delete(key)
        assert result is True
        assert await temp_storage.exists(key) is False

    @pytest.mark.asyncio
    async def test_delete_nonexistent(self, temp_storage):
        """Test delete of non-existent object."""
        result = await temp_storage.delete("nonexistent.txt")
        assert result is False

    @pytest.mark.asyncio
    async def test_list(self, temp_storage):
        """Test list operation."""
        # Upload multiple files
        await temp_storage.upload("file1.txt", b"data1", "text/plain")
        await temp_storage.upload("file2.txt", b"data2", "text/plain")
        await temp_storage.upload("subdir/file3.txt", b"data3", "text/plain")

        # List all
        all_objects = await temp_storage.list()
        assert len(all_objects) == 3

        # List with prefix
        prefixed = await temp_storage.list(prefix="subdir")
        assert len(prefixed) == 1
        # Handle Windows path separators
        assert "file3.txt" in prefixed[0].key

    @pytest.mark.asyncio
    async def test_get_metadata(self, temp_storage):
        """Test get_metadata operation."""
        key = "test/metadata.txt"
        data = b"Test data"

        await temp_storage.upload(key, data, "text/plain")
        metadata = await temp_storage.get_metadata(key)

        assert metadata is not None
        assert metadata.key == key
        assert metadata.size == len(data)

    @pytest.mark.asyncio
    async def test_get_metadata_nonexistent(self, temp_storage):
        """Test get_metadata of non-existent object."""
        metadata = await temp_storage.get_metadata("nonexistent.txt")
        assert metadata is None

    @pytest.mark.asyncio
    async def test_generate_signed_url(self, temp_storage):
        """Test generate_signed_url operation."""
        key = "test/signed.txt"
        data = b"Test data"

        await temp_storage.upload(key, data, "text/plain")
        url = await temp_storage.generate_signed_url(key)

        assert url.startswith("file://")
        # Handle Windows path separators
        assert "signed.txt" in url

    @pytest.mark.asyncio
    async def test_generate_signed_url_nonexistent(self, temp_storage):
        """Test generate_signed_url of non-existent object."""
        with pytest.raises(ObjectNotFoundError):
            await temp_storage.generate_signed_url("nonexistent.txt")

    @pytest.mark.asyncio
    async def test_move(self, temp_storage):
        """Test move operation."""
        source_key = "test/move_source.txt"
        dest_key = "test/move_dest.txt"
        data = b"Test data"

        await temp_storage.upload(source_key, data, "text/plain")
        result = await temp_storage.move(source_key, dest_key)

        assert result is True
        assert await temp_storage.exists(source_key) is False
        assert await temp_storage.exists(dest_key) is True

    @pytest.mark.asyncio
    async def test_copy(self, temp_storage):
        """Test copy operation."""
        source_key = "test/copy_source.txt"
        dest_key = "test/copy_dest.txt"
        data = b"Test data"

        await temp_storage.upload(source_key, data, "text/plain")
        result = await temp_storage.copy(source_key, dest_key)

        assert result is True
        assert await temp_storage.exists(source_key) is True
        assert await temp_storage.exists(dest_key) is True

    @pytest.mark.asyncio
    async def test_get_health(self, temp_storage):
        """Test get_health operation."""
        health = await temp_storage.get_health()

        assert health["status"] == "healthy"
        assert health["provider"] == "local"
        assert "root_path" in health
        assert health["writable"] is True

    @pytest.mark.asyncio
    async def test_set_metadata(self, temp_storage):
        """Test set_metadata operation."""
        key = "test/set_meta.txt"
        data = b"Test data"

        await temp_storage.upload(key, data, "text/plain")
        result = await temp_storage.set_metadata(key, {"custom": "value"})

        assert result is True

    @pytest.mark.asyncio
    async def test_checksum_calculation(self, temp_storage):
        """Test that checksum is calculated correctly."""
        key = "test/checksum.txt"
        data = b"Test data for checksum"

        result = await temp_storage.upload(key, data, "text/plain")

        # Verify checksum is SHA256
        import hashlib
        expected = hashlib.sha256(data).hexdigest()
        assert result.checksum == expected


class TestStorageProviderInterface:
    """Tests for StorageProvider interface compliance."""

    def test_local_provider_implements_interface(self):
        """Test that LocalStorageProvider implements StorageProvider."""
        assert issubclass(LocalStorageProvider, StorageProvider)

    def test_all_methods_are_abstract(self):
        """Test that all required methods are defined."""
        required_methods = [
            "upload",
            "download",
            "delete",
            "exists",
            "move",
            "copy",
            "list",
            "get_metadata",
            "set_metadata",
            "generate_signed_url",
            "get_health",
        ]

        for method in required_methods:
            assert hasattr(StorageProvider, method), f"Missing method: {method}"


class TestStorageFactory:
    """Tests for storage provider factory."""

    def test_create_local_provider(self):
        """Test creating local storage provider."""
        from app.media.infrastructure.providers.factory import create_storage_provider

        provider = create_storage_provider()
        assert isinstance(provider, LocalStorageProvider)

    def test_factory_exports(self):
        """Test that factory exports all providers."""
        from app.media.infrastructure.providers import (
            LocalStorageProvider,
            S3StorageProvider,
            AzureBlobStorageProvider,
            MinIOStorageProvider,
            create_storage_provider,
            get_storage_provider,
        )

        assert LocalStorageProvider is not None
        assert S3StorageProvider is not None
        assert AzureBlobStorageProvider is not None
        assert MinIOStorageProvider is not None
        assert callable(create_storage_provider)
        assert callable(get_storage_provider)


class TestStorageObject:
    """Tests for StorageObject dataclass."""

    def test_storage_object_creation(self):
        """Test StorageObject creation."""
        obj = StorageObject(
            key="test.txt",
            size=100,
            mime_type="text/plain",
            checksum="abc123",
        )

        assert obj.key == "test.txt"
        assert obj.size == 100
        assert obj.mime_type == "text/plain"
        assert obj.checksum == "abc123"
        assert obj.metadata is None
        assert obj.created_at is None
        assert obj.updated_at is None

    def test_storage_object_with_metadata(self):
        """Test StorageObject with metadata."""
        obj = StorageObject(
            key="test.txt",
            size=100,
            mime_type="text/plain",
            metadata={"custom": "value"},
        )

        assert obj.metadata == {"custom": "value"}