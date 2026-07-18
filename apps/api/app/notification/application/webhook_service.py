"""Notification webhook service."""

import json
from typing import Any
from uuid import UUID

from app.core.logging import logger
from app.notification.infrastructure.models import (
    NotificationChannel,
    NotificationStatus,
)
from app.notification.infrastructure.repositories import (
    NotificationRepository,
)


class WebhookDelivery:
    """Webhook delivery configuration."""

    def __init__(
        self,
        url: str,
        secret: str | None = None,
        headers: dict[str, str] | None = None,
        timeout: int = 30,
        retry_count: int = 3,
    ):
        """Initialize webhook delivery."""
        self.url = url
        self.secret = secret
        self.headers = headers or {}
        self.timeout = timeout
        self.retry_count = retry_count

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "url": self.url,
            "headers": self.headers,
            "timeout": self.timeout,
            "retry_count": self.retry_count,
        }


class WebhookService:
    """Webhook notification service."""

    def __init__(self, notification_repo: NotificationRepository):
        """Initialize webhook service."""
        self.notification_repo = notification_repo

    async def send_webhook(
        self,
        url: str,
        payload: dict[str, Any],
        secret: str | None = None,
        headers: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        """Send a webhook notification."""
        import aiohttp

        delivery = WebhookDelivery(url=url, secret=secret, headers=headers)
        result = {
            "url": url,
            "success": False,
            "status_code": None,
            "response": None,
            "error": None,
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    json=payload,
                    headers=delivery.headers,
                    timeout=aiohttp.ClientTimeout(total=delivery.timeout),
                ) as response:
                    result["status_code"] = response.status
                    result["response"] = await response.text()
                    result["success"] = 200 <= response.status < 300
        except Exception as e:
            result["error"] = str(e)
            logger.error(f"Webhook delivery failed: {e}")

        return result

    async def send_notification_webhook(
        self,
        notification_id: UUID,
    ) -> dict[str, Any]:
        """Send notification via webhook."""
        if self.notification_repo is None:
            return {"success": False, "error": "Repository not configured"}

        # Get notification
        notification = await self.notification_repo.get_by_id(notification_id)
        if not notification:
            return {"success": False, "error": "Notification not found"}

        # Build payload
        payload = {
            "id": str(notification.id),
            "category": notification.category.value,
            "channel": notification.channel.value,
            "subject": notification.subject,
            "body": notification.body,
            "status": notification.status.value,
            "priority": notification.priority.value,
            "created_at": notification.created_at.isoformat() if notification.created_at else None,
        }

        return await self.send_webhook(
            url=notification.destination or "",
            payload=payload,
        )


# Webhook event types
WEBHOOK_EVENTS: dict[str, str] = {
    "notification.created": "Notification was created",
    "notification.sent": "Notification was sent",
    "notification.delivered": "Notification was delivered",
    "notification.failed": "Notification failed",
    "notification.opened": "Notification was opened",
    "notification.cancelled": "Notification was cancelled",
}