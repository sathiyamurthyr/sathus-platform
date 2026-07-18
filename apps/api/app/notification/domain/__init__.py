"""Notification domain module."""

from app.notification.domain.models import (
    NotificationChannel,
    NotificationStatus,
    NotificationPriority,
    NotificationCategory,
    NotificationRecipient,
    NotificationTemplate,
    Notification,
    NotificationPreferences,
)
from app.notification.domain.events import (
    NotificationCreated,
    NotificationQueued,
    NotificationSent,
    NotificationDelivered,
    NotificationOpened,
    NotificationFailed,
    NotificationCancelled,
)

__all__ = [
    "NotificationChannel",
    "NotificationStatus",
    "NotificationPriority",
    "NotificationCategory",
    "NotificationRecipient",
    "NotificationTemplate",
    "Notification",
    "NotificationPreferences",
    "NotificationCreated",
    "NotificationQueued",
    "NotificationSent",
    "NotificationDelivered",
    "NotificationOpened",
    "NotificationFailed",
    "NotificationCancelled",
]