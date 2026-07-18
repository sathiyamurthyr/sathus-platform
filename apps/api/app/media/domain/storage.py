"""Storage provider abstraction for the Media module."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass
class StorageObject:
    """Represents a stored object with metadata."""

    key: str
    size: int
    mime_type: str
    checksum: str | None = None
    metadata: dict[str, Any] | None = None
    created_at: str | None = None
    updated_at: str | None = None


class StorageProvider(ABC):
    """Abstract storage provider interface."""

    @abstractmethod
    async def upload(
        self,
        key: str,
        data: bytes | AsyncIterator[bytes],
        mime_type: str,
        metadata: dict[str, Any] | None = None,
    ) -> StorageObject:
        """Upload data to storage."""
        pass

    @abstractmethod
    async def download(self, key: str) -> bytes:
        """Download data from storage."""
        pass

    @abstractmethod
    async def delete(self, key: str) -> bool:
        """Delete object from storage."""
        pass

    @abstractmethod
    async def exists(self, key: str) -> bool:
        """Check if object exists in storage."""
        pass

    @abstractmethod
    async def move(self, source_key: str, dest_key: str) -> bool:
        """Move object within storage."""
        pass

    @abstractmethod
    async def copy(self, source_key: str, dest_key: str) -> bool:
        """Copy object within storage."""
        pass

    @abstractmethod
    async def list(self, prefix: str | None = None) -> list[StorageObject]:
        """List objects in storage with optional prefix."""
        pass

    @abstractmethod
    async def get_metadata(self, key: str) -> StorageObject | None:
        """Get object metadata without downloading content."""
        pass

    @abstractmethod
    async def set_metadata(self, key: str, metadata: dict[str, Any]) -> bool:
        """Set object metadata."""
        pass

    @abstractmethod
    async def generate_signed_url(
        self,
        key: str,
        expires_in: int = 3600,
        method: str = "GET",
    ) -> str:
        """Generate a signed URL for object access."""
        pass

    @abstractmethod
    async def get_health(self) -> dict[str, Any]:
        """Get storage provider health status."""
        pass