"""Notification provider abstraction contracts."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any
from uuid import UUID


@dataclass
class PushMessage:
    """Push notification message contract."""

    device_token: str
    title: str
    body: str
    badge_count: int | None = None
    sound: str | None = "default"
    data: dict[str, Any] = field(default_factory=dict)
    tenant_id: UUID | None = None


@dataclass
class WebhookMessage:
    """Webhook message contract."""

    target_url: str
    event_type: str
    payload: dict[str, Any]
    headers: dict[str, str] = field(default_factory=dict)
    secret: str | None = None
    tenant_id: UUID | None = None


class PushProvider(ABC):
    """Abstract interface for Push Notification providers (e.g. FCM, APNS)."""

    @abstractmethod
    async def send(self, message: PushMessage) -> str:
        """Send a push notification.

        Args:
            message: Push notification message.

        Returns:
            Message ID or provider reference.
        """
        pass

    @abstractmethod
    async def validate(self) -> bool:
        """Validate push provider credentials.

        Returns:
            True if configured and reachable.
        """
        pass

    @abstractmethod
    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get push notification status.

        Args:
            message_id: Provider message ID.

        Returns:
            Status details dictionary.
        """
        pass


class WebhookProvider(ABC):
    """Abstract interface for Webhook delivery providers."""

    @abstractmethod
    async def send(self, message: WebhookMessage) -> str:
        """Dispatch a webhook payload.

        Args:
            message: Webhook message payload.

        Returns:
            Delivery reference ID.
        """
        pass

    @abstractmethod
    async def validate(self) -> bool:
        """Validate webhook delivery configuration.

        Returns:
            True if provider is operational.
        """
        pass

    @abstractmethod
    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get webhook delivery status.

        Args:
            message_id: Webhook message ID.

        Returns:
            Status details dictionary.
        """
        pass
