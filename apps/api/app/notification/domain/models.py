"""Notification domain models."""

from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field


class NotificationChannel(StrEnum):
    """Notification channel enumeration."""

    IN_APP = "in_app"
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    WEBHOOK = "webhook"


class NotificationStatus(StrEnum):
    """Notification status enumeration."""

    PENDING = "pending"
    QUEUED = "queued"
    SENT = "sent"
    DELIVERED = "delivered"
    OPENED = "opened"
    FAILED = "failed"
    CANCELLED = "cancelled"


class NotificationPriority(StrEnum):
    """Notification priority enumeration."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"


class NotificationCategory(StrEnum):
    """Notification category enumeration."""

    SYSTEM = "system"
    USER = "user"
    WORKFLOW = "workflow"
    ALERT = "alert"
    MARKETING = "marketing"


class NotificationRecipient(BaseModel):
    """Notification recipient value object."""

    user_id: UUID
    channel: NotificationChannel
    destination: str | None = None  # email, phone, device token, webhook URL


class NotificationTemplate(BaseModel):
    """Notification template value object."""

    id: UUID
    name: str
    subject: str | None = None
    body: str
    channel: NotificationChannel
    variables: list[str] = Field(default_factory=list)
    version: int = 1
    is_active: bool = True


class Notification(BaseModel):
    """Notification aggregate root."""

    id: UUID
    template_id: UUID | None = None
    category: NotificationCategory
    priority: NotificationPriority = NotificationPriority.NORMAL
    subject: str | None = None
    body: str
    status: NotificationStatus = NotificationStatus.PENDING
    recipient: NotificationRecipient
    scheduled_at: datetime | None = None
    sent_at: datetime | None = None
    delivered_at: datetime | None = None
    opened_at: datetime | None = None
    failure_reason: str | None = None
    retry_count: int = 0
    max_retries: int = 3
    metadata: dict = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class NotificationPreferences(BaseModel):
    """User notification preferences value object."""

    user_id: UUID
    email_enabled: bool = True
    sms_enabled: bool = True
    push_enabled: bool = True
    in_app_enabled: bool = True
    quiet_hours_start: str | None = None  # HH:MM format
    quiet_hours_end: str | None = None  # HH:MM format
    timezone: str = "UTC"
    language: str = "en"
    frequency: str = "immediate"  # immediate, digest, daily, weekly

    class Config:
        """Pydantic config."""

        frozen = True