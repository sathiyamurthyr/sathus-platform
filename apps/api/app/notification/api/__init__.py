"""Notification API module."""

from app.notification.api.schemas import (
    NotificationCreateRequest,
    NotificationResponse,
    NotificationTemplateCreateRequest,
    NotificationTemplateResponse,
    NotificationPreferencesUpdateRequest,
    NotificationPreferencesResponse,
    UnreadCountResponse,
    NotificationStatusResponse,
)

__all__ = [
    "NotificationCreateRequest",
    "NotificationResponse",
    "NotificationTemplateCreateRequest",
    "NotificationTemplateResponse",
    "NotificationPreferencesUpdateRequest",
    "NotificationPreferencesResponse",
    "UnreadCountResponse",
    "NotificationStatusResponse",
]