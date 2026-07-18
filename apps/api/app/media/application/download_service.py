"""Download service for secure media downloads and signed URLs."""

import hashlib
import hmac
import secrets
import time
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any
from uuid import UUID

from app.core.config import get_settings
from app.core.logging import logger
from app.media.domain.models import Asset, AssetStatus, StorageProvider
from app.media.domain.download_exceptions import (
    DownloadAuthorizationError,
    DownloadExpiredError,
    DownloadLimitExceededError,
    FileUnavailableError,
    InvalidDownloadTokenError,
    SignedUrlGenerationError,
)
from app.media.infrastructure.providers.factory import create_storage_provider


@dataclass
class DownloadToken:
    """Download token for secure access."""

    token: str
    asset_id: UUID
    user_id: UUID
    expires_at: datetime
    max_downloads: int = 1
    download_count: int = 0
    one_time: bool = True
    created_at: datetime = datetime.now()


@dataclass
class DownloadResponse:
    """Response for download request."""

    url: str
    expires_at: datetime
    token: str
    remaining_downloads: int
    metadata: dict[str, Any]


class DownloadService:
    """Service for secure downloads and signed URL generation."""

    def __init__(self, asset_repo: Any):
        """Initialize download service.

        Args:
            asset_repo: Asset repository for database operations.
        """
        self.settings = get_settings()
        self.asset_repo = asset_repo
        self.storage = create_storage_provider()
        self._tokens: dict[str, DownloadToken] = {}

    def _generate_token(self) -> str:
        """Generate a secure download token.

        Returns:
            Secure random token string.
        """
        return secrets.token_urlsafe(32)

    def _sign_url(self, url: str, secret: str) -> str:
        """Sign a URL with HMAC signature.

        Args:
            url: URL to sign.
            secret: Secret key for signing.

        Returns:
            Signed URL with signature parameter.
        """
        signature = hmac.new(
            secret.encode(),
            url.encode(),
            hashlib.sha256,
        ).hexdigest()
        separator = "&" if "?" in url else "?"
        return f"{url}{separator}signature={signature}"

    async def authorize_download(
        self,
        asset: Asset,
        user_id: UUID,
    ) -> None:
        """Authorize a download request.

        Args:
            asset: Asset to download.
            user_id: User requesting download.

        Raises:
            DownloadAuthorizationError: If not authorized.
            FileUnavailableError: If file is unavailable.
        """
        if asset.status != AssetStatus.READY:
            raise FileUnavailableError("Asset is not ready for download")

        if asset.deleted_at is not None:
            raise FileUnavailableError("Asset has been deleted")

    async def generate_signed_url(
        self,
        asset: Asset,
        user_id: UUID,
        expires_in_minutes: int | None = None,
        one_time: bool = True,
    ) -> DownloadResponse:
        """Generate a signed URL for download.

        Args:
            asset: Asset to download.
            user_id: User requesting download.
            expires_in_minutes: URL expiration time.
            one_time: Whether URL can be used only once.

        Returns:
            DownloadResponse with signed URL.

        Raises:
            SignedUrlGenerationError: If URL generation fails.
        """
        await self.authorize_download(asset, user_id)

        expires_in = expires_in_minutes or self.settings.SIGNED_URL_EXPIRY_MINUTES
        expires_at = datetime.now() + timedelta(minutes=expires_in)

        token = self._generate_token()

        try:
            if asset.storage_provider == StorageProvider.LOCAL:
                url = await self._generate_local_url(asset, token)
            elif asset.storage_provider == StorageProvider.S3:
                url = await self._generate_s3_url(asset, expires_in)
            elif asset.storage_provider == StorageProvider.AZURE:
                url = await self._generate_azure_url(asset, expires_in)
            elif asset.storage_provider == StorageProvider.MINIO:
                url = await self._generate_minio_url(asset, expires_in)
            else:
                raise SignedUrlGenerationError(
                    f"Unsupported storage provider: {asset.storage_provider}"
                )
        except Exception as e:
            raise SignedUrlGenerationError(str(e))

        download_token = DownloadToken(
            token=token,
            asset_id=asset.id,
            user_id=user_id,
            expires_at=expires_at,
            one_time=one_time,
        )
        self._tokens[token] = download_token

        return DownloadResponse(
            url=url,
            expires_at=expires_at,
            token=token,
            remaining_downloads=1 if one_time else 100,
            metadata={
                "filename": asset.filename,
                "content_type": asset.content_type,
                "file_size": asset.file_size,
            },
        )

    async def _generate_local_url(self, asset: Asset, token: str) -> str:
        """Generate signed URL for local storage.

        Args:
            asset: Asset to download.
            token: Download token.

        Returns:
            Signed download URL.
        """
        base_url = f"/api/v1/media/download/{token}"
        return self._sign_url(base_url, self.settings.SECRET_KEY)

    async def _generate_s3_url(self, asset: Asset, expires_in: int) -> str:
        """Generate presigned URL for S3.

        Args:
            asset: Asset to download.
            expires_in: Expiration time in minutes.

        Returns:
            Presigned S3 URL.
        """
        # Placeholder for S3 presigned URL generation
        # In production, this would use boto3 to generate presigned URLs
        return f"https://{self.settings.AWS_BUCKET}.s3.amazonaws.com/{asset.storage_path}?X-Amz-Expires={expires_in * 60}"

    async def _generate_azure_url(self, asset: Asset, expires_in: int) -> str:
        """Generate SAS URL for Azure Blob.

        Args:
            asset: Asset to download.
            expires_in: Expiration time in minutes.

        Returns:
            SAS URL.
        """
        # Placeholder for Azure SAS URL generation
        # In production, this would use azure-storage-blob to generate SAS URLs
        return f"https://{self.settings.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/{asset.storage_path}?sv=2020-08-04&se={int(time.time()) + expires_in * 60}"

    async def _generate_minio_url(self, asset: Asset, expires_in: int) -> str:
        """Generate presigned URL for MinIO.

        Args:
            asset: Asset to download.
            expires_in: Expiration time in minutes.

        Returns:
            Presigned MinIO URL.
        """
        # Placeholder for MinIO presigned URL generation
        # In production, this would use minio Python SDK
        return f"http://{self.settings.MINIO_ENDPOINT}/{asset.storage_path}?X-Minio-Expires={expires_in * 60}"

    async def validate_token(self, token: str) -> DownloadToken:
        """Validate a download token.

        Args:
            token: Download token to validate.

        Returns:
            DownloadToken if valid.

        Raises:
            InvalidDownloadTokenError: If token is invalid.
            DownloadExpiredError: If token has expired.
            DownloadLimitExceededError: If download limit exceeded.
        """
        if token not in self._tokens:
            raise InvalidDownloadTokenError()

        download_token = self._tokens[token]

        if download_token.expires_at < datetime.now():
            del self._tokens[token]
            raise DownloadExpiredError()

        if download_token.one_time and download_token.download_count >= download_token.max_downloads:
            del self._tokens[token]
            raise DownloadLimitExceededError()

        return download_token

    async def process_download(
        self,
        token: str,
        ip_address: str,
        user_agent: str,
    ) -> DownloadResponse:
        """Process a download request.

        Args:
            token: Download token.
            ip_address: Client IP address.
            user_agent: Client user agent.

        Returns:
            DownloadResponse with download details.

        Raises:
            InvalidDownloadTokenError: If token is invalid.
            DownloadExpiredError: If token has expired.
        """
        download_token = await self.validate_token(token)

        # Increment download count
        download_token.download_count += 1

        # Log download (audit)
        logger.info(
            "Download started",
            extra={
                "asset_id": str(download_token.asset_id),
                "user_id": str(download_token.user_id),
                "ip_address": ip_address,
                "user_agent": user_agent,
            },
        )

        # Remove one-time tokens after use
        if download_token.one_time and download_token.download_count >= download_token.max_downloads:
            del self._tokens[token]

        return DownloadResponse(
            url=f"/api/v1/media/download/{token}",
            expires_at=download_token.expires_at,
            token=token,
            remaining_downloads=download_token.max_downloads - download_token.download_count,
            metadata={},
        )

    async def get_download_info(self, asset_id: UUID) -> dict[str, Any]:
        """Get download information for an asset.

        Args:
            asset_id: Asset ID.

        Returns:
            Download information.
        """
        asset = await self.asset_repo.get(asset_id)
        if not asset:
            raise FileUnavailableError()

        return {
            "id": str(asset.id),
            "filename": asset.filename,
            "content_type": asset.content_type,
            "file_size": asset.file_size,
            "status": asset.status.value,
        }

    async def cleanup_expired_tokens(self) -> int:
        """Clean up expired download tokens.

        Returns:
            Number of tokens removed.
        """
        now = datetime.now()
        expired = [
            token for token, data in self._tokens.items()
            if data.expires_at < now
        ]

        for token in expired:
            del self._tokens[token]

        if expired:
            logger.info(f"Cleaned up {len(expired)} expired download tokens")

        return len(expired)