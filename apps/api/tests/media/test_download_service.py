"""Tests for download service."""

import pytest
from datetime import datetime, timedelta
from unittest.mock import MagicMock, AsyncMock
from uuid import UUID, uuid4

from app.media.application.download_service import (
    DownloadService,
    DownloadToken,
    DownloadResponse,
)
from app.media.domain.download_exceptions import (
    DownloadAuthorizationError,
    DownloadExpiredError,
    DownloadLimitExceededError,
    FileUnavailableError,
    InvalidDownloadTokenError,
    SignedUrlGenerationError,
)
from app.media.domain.models import Asset, AssetStatus, AssetType, StorageProvider


class TestDownloadToken:
    """Tests for DownloadToken model."""

    def test_download_token_creation(self):
        """Test creating download token."""
        token = DownloadToken(
            token="test-token-123",
            asset_id=uuid4(),
            user_id=uuid4(),
            expires_at=datetime.now() + timedelta(hours=1),
        )
        assert token.token == "test-token-123"
        assert token.max_downloads == 1
        assert token.one_time is True

    def test_download_token_custom_values(self):
        """Test download token with custom values."""
        token = DownloadToken(
            token="test-token-456",
            asset_id=uuid4(),
            user_id=uuid4(),
            expires_at=datetime.now() + timedelta(hours=1),
            max_downloads=10,
            one_time=False,
        )
        assert token.max_downloads == 10
        assert token.one_time is False


class TestDownloadResponse:
    """Tests for DownloadResponse model."""

    def test_download_response_creation(self):
        """Test creating download response."""
        response = DownloadResponse(
            url="https://example.com/download",
            expires_at=datetime.now() + timedelta(hours=1),
            token="test-token",
            remaining_downloads=1,
            metadata={"filename": "test.pdf"},
        )
        assert response.url == "https://example.com/download"
        assert response.remaining_downloads == 1


class TestDownloadService:
    """Tests for DownloadService."""

    @pytest.fixture
    def mock_asset_repo(self):
        """Create mock asset repository."""
        return MagicMock()

    @pytest.fixture
    def download_service(self, mock_asset_repo):
        """Create download service instance."""
        return DownloadService(asset_repo=mock_asset_repo)

    def test_generate_token(self, download_service):
        """Test token generation."""
        token = download_service._generate_token()
        assert len(token) > 20
        assert token != download_service._generate_token()

    def test_sign_url(self, download_service):
        """Test URL signing."""
        url = "https://example.com/download"
        signed = download_service._sign_url(url, "secret")
        assert "signature=" in signed
        assert url in signed

    @pytest.mark.asyncio
    async def test_authorize_download_success(self, download_service):
        """Test successful download authorization."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )
        # Should not raise
        await download_service.authorize_download(asset, uuid4())

    @pytest.mark.asyncio
    async def test_authorize_download_unavailable(self, download_service):
        """Test download authorization for unavailable asset."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.PROCESSING,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )
        with pytest.raises(FileUnavailableError):
            await download_service.authorize_download(asset, uuid4())

    @pytest.mark.asyncio
    async def test_generate_signed_url_local(self, download_service):
        """Test signed URL generation for local storage."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        response = await download_service.generate_signed_url(asset, uuid4())
        assert response.url is not None
        assert "signature=" in response.url
        assert response.expires_at is not None

    @pytest.mark.asyncio
    async def test_generate_signed_url_s3(self, download_service):
        """Test signed URL generation for S3."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.S3,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        response = await download_service.generate_signed_url(asset, uuid4())
        assert "s3.amazonaws.com" in response.url

    @pytest.mark.asyncio
    async def test_generate_signed_url_azure(self, download_service):
        """Test signed URL generation for Azure."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.AZURE,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        response = await download_service.generate_signed_url(asset, uuid4())
        assert "blob.core.windows.net" in response.url

    @pytest.mark.asyncio
    async def test_generate_signed_url_minio(self, download_service):
        """Test signed URL generation for MinIO."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.MINIO,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        response = await download_service.generate_signed_url(asset, uuid4())
        assert "X-Minio-Expires" in response.url

    @pytest.mark.asyncio
    async def test_validate_token_success(self, download_service):
        """Test token validation success."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        response = await download_service.generate_signed_url(asset, uuid4())
        token = await download_service.validate_token(response.token)
        assert token.token == response.token

    @pytest.mark.asyncio
    async def test_validate_token_invalid(self, download_service):
        """Test token validation with invalid token."""
        with pytest.raises(InvalidDownloadTokenError):
            await download_service.validate_token("invalid-token")

    @pytest.mark.asyncio
    async def test_validate_token_expired(self, download_service):
        """Test token validation with expired token."""
        download_service._tokens["expired"] = DownloadToken(
            token="expired",
            asset_id=uuid4(),
            user_id=uuid4(),
            expires_at=datetime.now() - timedelta(hours=1),
        )

        with pytest.raises(DownloadExpiredError):
            await download_service.validate_token("expired")

    @pytest.mark.asyncio
    async def test_process_download(self, download_service):
        """Test download processing."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        response = await download_service.generate_signed_url(asset, uuid4())
        result = await download_service.process_download(
            response.token,
            "127.0.0.1",
            "Mozilla/5.0",
        )
        assert result.url is not None

    @pytest.mark.asyncio
    async def test_cleanup_expired_tokens(self, download_service):
        """Test cleanup of expired tokens."""
        download_service._tokens["expired1"] = DownloadToken(
            token="expired1",
            asset_id=uuid4(),
            user_id=uuid4(),
            expires_at=datetime.now() - timedelta(hours=1),
        )
        download_service._tokens["expired2"] = DownloadToken(
            token="expired2",
            asset_id=uuid4(),
            user_id=uuid4(),
            expires_at=datetime.now() - timedelta(hours=1),
        )
        download_service._tokens["valid"] = DownloadToken(
            token="valid",
            asset_id=uuid4(),
            user_id=uuid4(),
            expires_at=datetime.now() + timedelta(hours=1),
        )

        count = await download_service.cleanup_expired_tokens()
        assert count == 2
        assert "expired1" not in download_service._tokens
        assert "expired2" not in download_service._tokens
        assert "valid" in download_service._tokens


class TestDownloadExceptions:
    """Tests for download exceptions."""

    def test_download_authorization_error(self):
        """Test DownloadAuthorizationError message."""
        error = DownloadAuthorizationError("Test error")
        assert "Test error" in str(error)

    def test_download_expired_error(self):
        """Test DownloadExpiredError message."""
        error = DownloadExpiredError()
        assert "expired" in str(error).lower()

    def test_invalid_download_token_error(self):
        """Test InvalidDownloadTokenError message."""
        error = InvalidDownloadTokenError()
        assert "Invalid" in str(error)

    def test_file_unavailable_error(self):
        """Test FileUnavailableError message."""
        error = FileUnavailableError()
        assert "unavailable" in str(error).lower()

    def test_download_limit_exceeded_error(self):
        """Test DownloadLimitExceededError message."""
        error = DownloadLimitExceededError()
        assert "limit" in str(error).lower()

    def test_signed_url_generation_error(self):
        """Test SignedUrlGenerationError message."""
        error = SignedUrlGenerationError("Test error")
        assert "Test error" in str(error)