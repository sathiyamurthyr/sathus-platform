"""Notification domain models and value objects."""

from datetime import datetime
from enum import StrEnum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class NotificationChannel(StrEnum):
    """Notification channel enumeration."""

    IN_APP = "in_app"
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    WEBHOOK = "webhook"


class NotificationProvider(StrEnum):
    """Notification provider enumeration."""

    SENDGRID = "sendgrid"
    SMTP = "smtp"
    AWS_SES = "ses"
    TWILIO = "twilio"
    FCM = "fcm"
    GENERIC_WEBHOOK = "generic_webhook"
    IN_MEMORY = "in_memory"


class NotificationStatus(StrEnum):
    """Notification status enumeration."""

    DRAFT = "draft"
    PENDING = "pending"
    QUEUED = "queued"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    OPENED = "opened"
    FAILED = "failed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    ARCHIVED = "archived"


class NotificationPriority(StrEnum):
    """Notification priority enumeration."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"


class NotificationType(StrEnum):
    """Notification type enumeration."""

    SYSTEM = "system"
    SECURITY = "security"
    WORKFLOW = "workflow"
    CONTENT = "content"
    MEDIA = "media"
    MARKETING = "marketing"
    REMINDER = "reminder"
    ALERT = "alert"
    ANNOUNCEMENT = "announcement"
    CUSTOM = "custom"


class NotificationCategory(StrEnum):
    """Notification category enumeration."""

    SECURITY = "security"
    BILLING = "billing"
    WORKFLOW = "workflow"
    CONTENT = "content"
    MEDIA = "media"
    SYSTEM = "system"
    MARKETING = "marketing"
    USER = "user"
    ALERT = "alert"


class NotificationRecipient(BaseModel):
    """Notification recipient value object."""

    user_id: UUID
    channel: NotificationChannel
    destination: str | None = None  # email, phone, device token, webhook URL
    model_config = ConfigDict(frozen=True)


class NotificationSender(BaseModel):
    """Notification sender value object."""

    user_id: UUID | None = None
    name: str | None = None
    email: str | None = None
    model_config = ConfigDict(frozen=True)


class NotificationTemplate(BaseModel):
    """Notification template domain model."""

    id: UUID
    tenant_id: UUID | None = None
    name: str
    subject: str | None = None
    body: str
    channel: NotificationChannel
    category: NotificationCategory = NotificationCategory.SYSTEM
    variables: list[str] = Field(default_factory=list)
    version: int = 1
    is_active: bool = True
    is_deleted: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None

    model_config = ConfigDict(frozen=True)


class Notification(BaseModel):
    """Notification aggregate root domain model."""

    id: UUID
    tenant_id: UUID | None = None
    template_id: UUID | None = None
    type: NotificationType = NotificationType.SYSTEM
    category: NotificationCategory = NotificationCategory.SYSTEM
    channel: NotificationChannel = NotificationChannel.IN_APP
    priority: NotificationPriority = NotificationPriority.NORMAL
    sender: NotificationSender | None = None
    recipient: NotificationRecipient
    subject: str | None = None
    body: str
    status: NotificationStatus = NotificationStatus.DRAFT
    scheduled_at: datetime | None = None
    sent_at: datetime | None = None
    delivered_at: datetime | None = None
    read_at: datetime | None = None
    expiration: datetime | None = None
    correlation_id: UUID | None = None
    failure_reason: str | None = None
    retry_count: int = 0
    max_retries: int = 3
    is_deleted: bool = False
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None

    model_config = ConfigDict(frozen=True)


class NotificationPreferences(BaseModel):
    """User notification preferences domain model."""

    id: UUID | None = None
    tenant_id: UUID | None = None
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
    category_preferences: dict[str, bool] = Field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None

    model_config = ConfigDict(frozen=True)


class NotificationHistory(BaseModel):
    """Notification history log domain model."""

    id: UUID
    tenant_id: UUID | None = None
    notification_id: UUID
    user_id: UUID
    channel: NotificationChannel
    provider: NotificationProvider | str | None = None
    status: NotificationStatus
    event: str
    details: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime | None = None
    created_by: UUID | None = None

    model_config = ConfigDict(frozen=True)