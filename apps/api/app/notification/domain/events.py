"""Notification domain events."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class NotificationCreated(BaseModel):
    """Event emitted when a notification is created."""

    notification_id: UUID
    user_id: UUID
    category: str
    priority: str
    channel: str
    created_at: datetime


class NotificationQueued(BaseModel):
    """Event emitted when a notification is queued for delivery."""

    notification_id: UUID
    queued_at: datetime


class NotificationSent(BaseModel):
    """Event emitted when a notification is sent."""

    notification_id: UUID
    sent_at: datetime
    provider: str | None = None


class NotificationDelivered(BaseModel):
    """Event emitted when a notification is delivered."""

    notification_id: UUID
    delivered_at: datetime


class NotificationOpened(BaseModel):
    """Event emitted when a notification is opened/read."""

    notification_id: UUID
    opened_at: datetime


class NotificationFailed(BaseModel):
    """Event emitted when a notification fails to send."""

    notification_id: UUID
    failed_at: datetime
    reason: str
    retry_count: int


class NotificationCancelled(BaseModel):
    """Event emitted when a notification is cancelled."""

    notification_id: UUID
    cancelled_at: datetime
    reason: str | None = None