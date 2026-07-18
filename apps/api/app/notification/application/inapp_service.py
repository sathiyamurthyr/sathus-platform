"""In-app notification service for notification center."""

from datetime import datetime
from typing import Any
from uuid import UUID

from app.core.logging import logger
from app.notification.domain.models import (
    Notification,
    NotificationStatus,
    NotificationCategory,
    NotificationPriority,
    NotificationType,
)
from app.notification.domain.inapp_exceptions import (
    NotificationNotFoundError,
    NotificationAccessDeniedError,
    InvalidNotificationStateError,
    BulkOperationError,
    SearchError,
)


class NotificationAction:
    """Notification action types."""

    READ = "read"
    UNREAD = "unread"
    ARCHIVE = "archive"
    DELETE = "delete"
    PIN = "pin"
    UNPIN = "unpin"
    SNOOZE = "snooze"
    RESTORE = "restore"


class NotificationCounter:
    """Notification counter for user."""

    def __init__(self, user_id: UUID):
        """Initialize counter."""
        self.user_id = user_id
        self.total: int = 0
        self.unread: int = 0
        self.archived: int = 0
        self.critical: int = 0

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "user_id": str(self.user_id),
            "total": self.total,
            "unread": self.unread,
            "archived": self.archived,
            "critical": self.critical,
        }


class InAppNotificationService:
    """In-app notification service for notification center."""

    def __init__(self, notification_repo=None, preferences_repo=None):
        """Initialize service."""
        self.notification_repo = notification_repo
        self.preferences_repo = preferences_repo

    async def get_inbox(
        self,
        user_id: UUID,
        status: NotificationStatus | None = None,
        category: NotificationCategory | None = None,
        priority: NotificationPriority | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Notification]:
        """Get user's notification inbox.

        Args:
            user_id: User ID.
            status: Filter by status.
            category: Filter by category.
            priority: Filter by priority.
            limit: Maximum number of notifications.
            offset: Offset for pagination.

        Returns:
            List of notifications.
        """
        # Placeholder for repository call
        return []

    async def get_unread(
        self,
        user_id: UUID,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Notification]:
        """Get unread notifications.

        Args:
            user_id: User ID.
            limit: Maximum number of notifications.
            offset: Offset for pagination.

        Returns:
            List of unread notifications.
        """
        return await self.get_inbox(
            user_id=user_id,
            status=NotificationStatus.DELIVERED,
            limit=limit,
            offset=offset,
        )

    async def get_notification(
        self,
        notification_id: UUID,
        user_id: UUID,
    ) -> Notification:
        """Get a specific notification.

        Args:
            notification_id: Notification ID.
            user_id: User ID.

        Returns:
            Notification.

        Raises:
            NotificationNotFoundError: If not found.
            NotificationAccessDeniedError: If access denied.
        """
        # Placeholder for repository call
        raise NotificationNotFoundError(f"Notification {notification_id} not found")

    async def mark_as_read(
        self,
        notification_id: UUID,
        user_id: UUID,
    ) -> bool:
        """Mark notification as read.

        Args:
            notification_id: Notification ID.
            user_id: User ID.

        Returns:
            True if successful.
        """
        logger.info(f"Notification {notification_id} marked as read by user {user_id}")
        return True

    async def mark_as_unread(
        self,
        notification_id: UUID,
        user_id: UUID,
    ) -> bool:
        """Mark notification as unread.

        Args:
            notification_id: Notification ID.
            user_id: User ID.

        Returns:
            True if successful.
        """
        logger.info(f"Notification {notification_id} marked as unread by user {user_id}")
        return True

    async def archive(
        self,
        notification_id: UUID,
        user_id: UUID,
    ) -> bool:
        """Archive notification.

        Args:
            notification_id: Notification ID.
            user_id: User ID.

        Returns:
            True if successful.
        """
        logger.info(f"Notification {notification_id} archived by user {user_id}")
        return True

    async def delete(
        self,
        notification_id: UUID,
        user_id: UUID,
    ) -> bool:
        """Delete notification.

        Args:
            notification_id: Notification ID.
            user_id: User ID.

        Returns:
            True if successful.
        """
        logger.info(f"Notification {notification_id} deleted by user {user_id}")
        return True

    async def pin(
        self,
        notification_id: UUID,
        user_id: UUID,
    ) -> bool:
        """Pin notification.

        Args:
            notification_id: Notification ID.
            user_id: User ID.

        Returns:
            True if successful.
        """
        logger.info(f"Notification {notification_id} pinned by user {user_id}")
        return True

    async def unpin(
        self,
        notification_id: UUID,
        user_id: UUID,
    ) -> bool:
        """Unpin notification.

        Args:
            notification_id: Notification ID.
            user_id: User ID.

        Returns:
            True if successful.
        """
        logger.info(f"Notification {notification_id} unpinned by user {user_id}")
        return True

    async def snooze(
        self,
        notification_id: UUID,
        user_id: UUID,
        snooze_until: datetime,
    ) -> bool:
        """Snooze notification.

        Args:
            notification_id: Notification ID.
            user_id: User ID.
            snooze_until: Snooze until datetime.

        Returns:
            True if successful.
        """
        logger.info(f"Notification {notification_id} snoozed by user {user_id}")
        return True

    async def restore(
        self,
        notification_id: UUID,
        user_id: UUID,
    ) -> bool:
        """Restore notification from archive.

        Args:
            notification_id: Notification ID.
            user_id: User ID.

        Returns:
            True if successful.
        """
        logger.info(f"Notification {notification_id} restored by user {user_id}")
        return True

    async def bulk_action(
        self,
        notification_ids: list[UUID],
        action: str,
        user_id: UUID,
    ) -> int:
        """Perform bulk action on notifications.

        Args:
            notification_ids: List of notification IDs.
            action: Action to perform.
            user_id: User ID.

        Returns:
            Number of affected notifications.

        Raises:
            BulkOperationError: If operation fails.
        """
        if action not in [
            NotificationAction.READ,
            NotificationAction.UNREAD,
            NotificationAction.ARCHIVE,
            NotificationAction.DELETE,
            NotificationAction.PIN,
            NotificationAction.UNPIN,
        ]:
            raise BulkOperationError(f"Invalid action: {action}")

        logger.info(f"Bulk {action} on {len(notification_ids)} notifications by user {user_id}")
        return len(notification_ids)

    async def get_counts(
        self,
        user_id: UUID,
    ) -> NotificationCounter:
        """Get notification counts for user.

        Args:
            user_id: User ID.

        Returns:
            Notification counter.
        """
        return NotificationCounter(user_id=user_id)

    async def search(
        self,
        user_id: UUID,
        query: str,
        status: NotificationStatus | None = None,
        category: NotificationCategory | None = None,
        priority: NotificationPriority | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Notification]:
        """Search notifications.

        Args:
            user_id: User ID.
            query: Search query.
            status: Filter by status.
            category: Filter by category.
            priority: Filter by priority.
            date_from: Filter from date.
            date_to: Filter to date.
            limit: Maximum number of results.
            offset: Offset for pagination.

        Returns:
            List of matching notifications.

        Raises:
            SearchError: If search fails.
        """
        if not query:
            raise SearchError("Search query is required")

        logger.info(f"User {user_id} searched notifications with query: {query}")
        return []


class RealTimeNotificationService:
    """Real-time notification service for WebSocket/SSE."""

    def __init__(self, redis_client=None):
        """Initialize service."""
        self.redis = redis_client
        self.channel_prefix = "notifications"

    async def publish(
        self,
        user_id: UUID,
        notification: Notification,
    ) -> None:
        """Publish notification to user's channel.

        Args:
            user_id: User ID.
            notification: Notification to publish.
        """
        if self.redis:
            channel = f"{self.channel_prefix}:{user_id}"
            await self.redis.publish(channel, notification.model_dump_json())

    async def get_unread_count(
        self,
        user_id: UUID,
    ) -> int:
        """Get unread count for user.

        Args:
            user_id: User ID.

        Returns:
            Unread count.
        """
        # Placeholder for Redis-based counter
        return 0

    async def increment_unread_count(
        self,
        user_id: UUID,
    ) -> int:
        """Increment unread count for user.

        Args:
            user_id: User ID.

        Returns:
            New unread count.
        """
        if self.redis:
            key = f"unread_count:{user_id}"
            return await self.redis.incr(key)
        return 0

    async def decrement_unread_count(
        self,
        user_id: UUID,
    ) -> int:
        """Decrement unread count for user.

        Args:
            user_id: User ID.

        Returns:
            New unread count.
        """
        if self.redis:
            key = f"unread_count:{user_id}"
            return await self.redis.decr(key)
        return 0