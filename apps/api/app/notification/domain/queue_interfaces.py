"""Notification queue abstraction interfaces."""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any
from uuid import UUID


class NotificationQueue(ABC):
    """Abstract contract for Notification Queue implementations."""

    @abstractmethod
    async def enqueue(self, notification_id: UUID, payload: dict[str, Any]) -> bool:
        """Enqueue a notification for background dispatch.

        Args:
            notification_id: Unique notification ID.
            payload: Notification delivery payload.

        Returns:
            True if successfully queued.
        """
        pass

    @abstractmethod
    async def retry(self, notification_id: UUID) -> bool:
        """Re-queue a failed notification for retry.

        Args:
            notification_id: Notification ID.

        Returns:
            True if retry accepted.
        """
        pass

    @abstractmethod
    async def cancel(self, notification_id: UUID) -> bool:
        """Cancel a pending or queued notification.

        Args:
            notification_id: Notification ID.

        Returns:
            True if cancelled successfully.
        """
        pass

    @abstractmethod
    async def schedule(self, notification_id: UUID, run_at: datetime) -> bool:
        """Schedule a notification for future dispatch.

        Args:
            notification_id: Notification ID.
            run_at: Scheduled execution timestamp.

        Returns:
            True if scheduled.
        """
        pass

    @abstractmethod
    async def get_status(self, notification_id: UUID) -> dict[str, Any]:
        """Get the current queue processing status of a notification.

        Args:
            notification_id: Notification ID.

        Returns:
            Status summary dictionary.
        """
        pass
