"""Notification analytics service."""

from datetime import datetime, timedelta
from typing import Any
from uuid import UUID

from app.core.logging import logger
from app.notification.infrastructure.models import (
    NotificationCategory,
    NotificationChannel,
    NotificationStatus,
)
from app.notification.infrastructure.repositories import (
    NotificationRepository,
)


class NotificationAnalytics:
    """Notification analytics and metrics service."""

    def __init__(self, notification_repo: NotificationRepository):
        """Initialize analytics service."""
        self.notification_repo = notification_repo

    async def get_delivery_metrics(
        self,
        user_id: UUID | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> dict[str, Any]:
        """Get delivery metrics for notifications."""
        if self.notification_repo is None:
            return {
                "total_sent": 0,
                "total_delivered": 0,
                "total_failed": 0,
                "delivery_rate": 0.0,
            }

        # Get notifications in date range
        notifications = await self.notification_repo.get_user_notifications(
            user_id=user_id,
            limit=10000,
        )

        total = len(notifications)
        delivered = sum(1 for n in notifications if n.status == NotificationStatus.DELIVERED)
        failed = sum(1 for n in notifications if n.status == NotificationStatus.FAILED)
        opened = sum(1 for n in notifications if n.status == NotificationStatus.OPENED)

        return {
            "total_sent": total,
            "total_delivered": delivered,
            "total_failed": failed,
            "total_opened": opened,
            "delivery_rate": (delivered / total * 100) if total > 0 else 0.0,
            "open_rate": (opened / delivered * 100) if delivered > 0 else 0.0,
        }

    async def get_channel_metrics(
        self,
        user_id: UUID | None = None,
    ) -> dict[str, Any]:
        """Get metrics by channel."""
        if self.notification_repo is None:
            return {}

        notifications = await self.notification_repo.get_user_notifications(
            user_id=user_id,
            limit=10000,
        )

        channel_stats: dict[str, dict[str, int]] = {}
        for n in notifications:
            channel = n.channel.value
            if channel not in channel_stats:
                channel_stats[channel] = {"sent": 0, "delivered": 0, "failed": 0}
            channel_stats[channel]["sent"] += 1
            if n.status == NotificationStatus.DELIVERED:
                channel_stats[channel]["delivered"] += 1
            elif n.status == NotificationStatus.FAILED:
                channel_stats[channel]["failed"] += 1

        return channel_stats

    async def get_category_metrics(
        self,
        user_id: UUID | None = None,
    ) -> dict[str, Any]:
        """Get metrics by category."""
        if self.notification_repo is None:
            return {}

        notifications = await self.notification_repo.get_user_notifications(
            user_id=user_id,
            limit=10000,
        )

        category_stats: dict[str, dict[str, int]] = {}
        for n in notifications:
            category = n.category.value
            if category not in category_stats:
                category_stats[category] = {"sent": 0, "delivered": 0, "failed": 0}
            category_stats[category]["sent"] += 1
            if n.status == NotificationStatus.DELIVERED:
                category_stats[category]["delivered"] += 1
            elif n.status == NotificationStatus.FAILED:
                category_stats[category]["failed"] += 1

        return category_stats

    async def get_hourly_metrics(
        self,
        user_id: UUID | None = None,
        hours: int = 24,
    ) -> list[dict[str, Any]]:
        """Get hourly delivery metrics."""
        if self.notification_repo is None:
            return []

        notifications = await self.notification_repo.get_user_notifications(
            user_id=user_id,
            limit=10000,
        )

        hourly: dict[int, dict[str, int]] = {}
        for n in notifications:
            if n.sent_at:
                hour = n.sent_at.hour
                if hour not in hourly:
                    hourly[hour] = {"sent": 0, "delivered": 0, "failed": 0}
                hourly[hour]["sent"] += 1
                if n.status == NotificationStatus.DELIVERED:
                    hourly[hour]["delivered"] += 1
                elif n.status == NotificationStatus.FAILED:
                    hourly[hour]["failed"] += 1

        return [
            {"hour": h, "sent": stats["sent"], "delivered": stats["delivered"], "failed": stats["failed"]}
            for h, stats in sorted(hourly.items())
        ]


# Analytics event types
ANALYTICS_EVENTS: dict[str, str] = {
    "notification_sent": "Notification was sent",
    "notification_delivered": "Notification was delivered",
    "notification_opened": "Notification was opened",
    "notification_failed": "Notification failed to send",
    "template_used": "Template was used for notification",
    "preference_changed": "User changed notification preferences",
}