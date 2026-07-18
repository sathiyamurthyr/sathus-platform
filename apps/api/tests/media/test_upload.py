"""Tests for upload pipeline."""

import pytest
from datetime import datetime
from unittest.mock import MagicMock, AsyncMock, patch
from uuid import UUID, uuid4

from app.media.application.validation import UploadValidator
from app.media.application.virus_scan import VirusScanHook, NoOpVirusScanHook, VirusScanService
from app.media.domain.upload_exceptions import (
    UploadValidationError,
    FileTooLargeError,
    UnsupportedMediaTypeError,
    DuplicateFileError,
    StorageFailureError,
)
from app.media.domain.models import Asset, AssetStatus, AssetType, StorageProvider
from app.media.infrastructure.repositories import AssetRepository, FolderRepository, UploadSessionRepository


class TestUploadValidator:
    """Tests for upload validation."""

    @pytest.fixture
    def validator(self):
        """Create upload validator."""
        return UploadValidator()

    def test_validate_valid_image(self, validator):
        """Test validation of valid image file."""
        result = validator.validate(
            filename="test.jpg",
            content_type="image/jpeg",
            file_size=1024,
            data=b"test data",
        )
        assert result["valid"] is True
        assert result["extension"] == ".jpg"
        assert result["checksum"] is not None

    def test_validate_valid_document(self, validator):
        """Test validation of valid document file."""
        result = validator.validate(
            filename="test.pdf",
            content_type="application/pdf",
            file_size=2048,
            data=b"test data",
        )
        assert result["valid"] is True
        assert result["extension"] == ".pdf"

    def test_validate_file_too_large(self, validator):
        """Test validation fails for file too large."""
        with pytest.raises(FileTooLargeError):
            validator.validate(
                filename="test.jpg",
                content_type="image/jpeg",
                file_size=1024 * 1024 * 1024,  # 1GB
                data=b"test",
            )

    def test_validate_unsupported_mime_type(self, validator):
        """Test validation fails for unsupported MIME type."""
        with pytest.raises(UnsupportedMediaTypeError):
            validator.validate(
                filename="test.exe",
                content_type="application/octet-stream",
                file_size=1024,
                data=b"test",
            )

    def test_validate_invalid_extension(self, validator):
        """Test validation fails for invalid extension."""
        with pytest.raises(UploadValidationError):
            validator.validate(
                filename="test.exe",
                content_type="image/jpeg",
                file_size=1024,
                data=b"test",
            )

    def test_validate_unsafe_filename(self, validator):
        """Test validation fails for unsafe filename."""
        with pytest.raises(UploadValidationError):
            validator.validate(
                filename="../../../etc/passwd",
                content_type="image/jpeg",
                file_size=1024,
                data=b"test",
            )

    def test_validate_path_traversal(self, validator):
        """Test validation fails for path traversal attempt."""
        with pytest.raises(UploadValidationError):
            validator.validate(
                filename="..\\..\\windows\\system32",
                content_type="image/jpeg",
                file_size=1024,
                data=b"test",
            )

    def test_get_allowed_mime_types(self, validator):
        """Test getting allowed MIME types."""
        mime_types = validator.get_allowed_mime_types()
        assert "image/jpeg" in mime_types
        assert "application/pdf" in mime_types
        assert "video/mp4" in mime_types

    def test_get_allowed_extensions(self, validator):
        """Test getting allowed extensions."""
        extensions = validator.get_allowed_extensions()
        assert ".jpg" in extensions
        assert ".pdf" in extensions
        assert ".mp4" in extensions


class TestVirusScanService:
    """Tests for virus scan service."""

    def test_noop_hook_is_disabled(self):
        """Test NoOp hook is disabled."""
        hook = NoOpVirusScanHook()
        assert hook.is_enabled() is False

    @pytest.mark.asyncio
    async def test_noop_scan(self):
        """Test NoOp scan returns clean."""
        hook = NoOpVirusScanHook()
        result = await hook.scan(b"test data", "test.jpg")
        assert result["clean"] is True
        assert result["threats"] == []

    @pytest.mark.asyncio
    async def test_virus_scan_service_default(self):
        """Test virus scan service with default NoOp hook."""
        service = VirusScanService()
        result = await service.scan(b"test data", "test.jpg")
        assert result["clean"] is True


class TestMediaServiceUpload:
    """Tests for media service upload pipeline."""

    @pytest.fixture
    def mock_asset_repo(self):
        """Create mock asset repository."""
        return MagicMock(spec=AssetRepository)

    @pytest.fixture
    def mock_folder_repo(self):
        """Create mock folder repository."""
        return MagicMock(spec=FolderRepository)

    @pytest.fixture
    def mock_upload_session_repo(self):
        """Create mock upload session repository."""
        return MagicMock(spec=UploadSessionRepository)

    @pytest.fixture
    def media_service(self, mock_asset_repo, mock_folder_repo, mock_upload_session_repo):
        """Create media service with mocks."""
        from app.media.application.services import MediaService
        return MediaService(
            asset_repo=mock_asset_repo,
            folder_repo=mock_folder_repo,
            upload_session_repo=mock_upload_session_repo,
        )

    @pytest.mark.asyncio
    async def test_upload_file_success(self, media_service, mock_asset_repo):
        """Test successful file upload."""
        # Mock storage provider
        mock_provider = MagicMock()
        mock_provider.upload = AsyncMock(return_value=MagicMock(
            key="2024/01/15/test.jpg",
            size=1024,
            mime_type="image/jpeg",
            checksum="abc123",
        ))

        with patch(
            "app.media.application.services.create_storage_provider",
            return_value=mock_provider,
        ):
            # Mock asset creation
            test_asset = Asset(
                id=uuid4(),
                filename="test.jpg",
                original_filename="test.jpg",
                content_type="image/jpeg",
                file_size=1024,
                asset_type=AssetType.IMAGE,
                status=AssetStatus.READY,
                storage_provider=StorageProvider.LOCAL,
                storage_path="2024/01/15/test.jpg",
                created_by=uuid4(),
                created_at=datetime.now().isoformat(),
            )
            mock_asset_repo.create = AsyncMock(return_value=test_asset)
            mock_asset_repo.get_by_checksum = AsyncMock(return_value=None)

            # Upload file
            user_id = uuid4()
            asset = await media_service.upload_file(
                filename="test.jpg",
                original_filename="test.jpg",
                content_type="image/jpeg",
                data=b"test image data",
                user_id=user_id,
            )

            assert asset is not None
            assert asset.filename == "test.jpg"
            mock_provider.upload.assert_called_once()

    @pytest.mark.asyncio
    async def test_upload_file_duplicate_detection(
        self, media_service, mock_asset_repo
    ):
        """Test duplicate file detection."""
        # Mock existing asset
        existing_asset = Asset(
            id=uuid4(),
            filename="existing.jpg",
            original_filename="test.jpg",
            content_type="image/jpeg",
            file_size=1024,
            asset_type=AssetType.IMAGE,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.jpg",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )
        mock_asset_repo.get_by_checksum = AsyncMock(return_value=existing_asset)

        with pytest.raises(DuplicateFileError):
            await media_service.upload_file(
                filename="test.jpg",
                original_filename="test.jpg",
                content_type="image/jpeg",
                data=b"test image data",
                user_id=uuid4(),
            )

    @pytest.mark.asyncio
    async def test_upload_multiple_files(self, media_service):
        """Test uploading multiple files."""
        # Mock storage provider
        mock_provider = MagicMock()
        mock_provider.upload = AsyncMock(return_value=MagicMock(
            key="2024/01/15/test.jpg",
            size=1024,
            mime_type="image/jpeg",
            checksum="abc123",
        ))

        with patch(
            "app.media.application.services.create_storage_provider",
            return_value=mock_provider,
        ):
            # Mock asset creation
            test_asset = Asset(
                id=uuid4(),
                filename="test.jpg",
                original_filename="test.jpg",
                content_type="image/jpeg",
                file_size=1024,
                asset_type=AssetType.IMAGE,
                status=AssetStatus.READY,
                storage_provider=StorageProvider.LOCAL,
                storage_path="2024/01/15/test.jpg",
                created_by=uuid4(),
                created_at=datetime.now().isoformat(),
            )
            media_service.asset_repo.create = AsyncMock(return_value=test_asset)
            media_service.asset_repo.get_by_checksum = AsyncMock(return_value=None)

            files = [
                {
                    "filename": "test1.jpg",
                    "original_filename": "test1.jpg",
                    "content_type": "image/jpeg",
                    "data": b"test data 1",
                },
                {
                    "filename": "test2.jpg",
                    "original_filename": "test2.jpg",
                    "content_type": "image/jpeg",
                    "data": b"test data 2",
                },
            ]

            assets = await media_service.upload_multiple(files, uuid4())
            assert len(assets) == 2

    def test_generate_object_key(self, media_service):
        """Test object key generation."""
        key = media_service._generate_object_key("test.jpg")
        # Check format: YYYY/MM/DD/{uuid}.jpg
        parts = key.split("/")
        assert len(parts) == 4
        assert parts[3].endswith(".jpg")


class TestUploadExceptions:
    """Tests for upload exceptions."""

    def test_file_too_large_error(self):
        """Test FileTooLargeError message."""
        error = FileTooLargeError(2000, 1000)
        assert "2000" in str(error)
        assert "1000" in str(error)

    def test_unsupported_media_type_error(self):
        """Test UnsupportedMediaTypeError message."""
        error = UnsupportedMediaTypeError("application/x-unknown")
        assert "application/x-unknown" in str(error)

    def test_duplicate_file_error(self):
        """Test DuplicateFileError message."""
        error = DuplicateFileError("abc123checksum")
        assert "abc123checksum" in str(error)