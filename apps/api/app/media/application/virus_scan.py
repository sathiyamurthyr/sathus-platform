"""Virus scan hook interface for upload pipeline."""

from abc import ABC, abstractmethod
from typing import Any

from app.core.logging import logger


class VirusScanHook(ABC):
    """Abstract virus scan hook interface."""

    @abstractmethod
    async def scan(self, data: bytes, filename: str) -> dict[str, Any]:
        """Scan file data for viruses.

        Args:
            data: File data to scan.
            filename: Original filename.

        Returns:
            Scan result with 'clean' boolean and optional 'threats' list.
        """
        pass

    @abstractmethod
    def is_enabled(self) -> bool:
        """Check if virus scanning is enabled."""
        pass


class NoOpVirusScanHook(VirusScanHook):
    """No-op virus scan hook for development/testing."""

    def is_enabled(self) -> bool:
        """Virus scanning is disabled."""
        return False

    async def scan(self, data: bytes, filename: str) -> dict[str, Any]:
        """Skip virus scanning."""
        logger.info("virus_scan_skipped", filename=filename)
        return {"clean": True, "threats": []}


class VirusScanService:
    """Virus scan service that uses the configured hook."""

    def __init__(self, hook: VirusScanHook | None = None):
        """Initialize virus scan service.

        Args:
            hook: Optional virus scan hook. Defaults to NoOpVirusScanHook.
        """
        self.hook = hook or NoOpVirusScanHook()

    async def scan(self, data: bytes, filename: str) -> dict[str, Any]:
        """Scan file data for viruses.

        Args:
            data: File data to scan.
            filename: Original filename.

        Returns:
            Scan result.
        """
        if not self.hook.is_enabled():
            return {"clean": True, "threats": []}

        return await self.hook.scan(data, filename)