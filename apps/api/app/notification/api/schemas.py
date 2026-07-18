"""Notification API schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


# Request schemas
class NotificationCreateRequest(BaseModel):
    """Create notification request schema."""

    category: str
    channel: str
    body: str
    subject: str | None = None
    template_id: UUID | None = None
    priority: str = "normal"
    destination: str | None = None
    scheduled_at: datetime | None = None
    metadata: dict | None = None


class NotificationTemplateCreateRequest(BaseModel):
    """Create notification template request schema."""

    name: str = Field(..., min_length=1, max_length=255)
    body: str
    channel: str
    subject: str | None = None
    variables: list[str] | None = None


class NotificationPreferencesUpdateRequest(BaseModel):
    """Update notification preferences request schema."""

    email_enabled: bool | None = None
    sms_enabled: bool | None = None
    push_enabled: bool | None = None
    in_app_enabled: bool | None = None
    quiet_hours_start: str | None = None  # HH:MM format
    quiet_hours_end: str | None = None  # HH:MM format
    timezone: str | None = None
    language: str | None = None
    frequency: str | None = None


# Response schemas
class NotificationResponse(BaseModel):
    """Notification response schema."""

    id: UUID
    category: str
    channel: str
    subject: str | None = None
    body: str
    status: str
    priority: str
    scheduled_at: datetime | None = None
    sent_at: datetime | None = None
    delivered_at: datetime | None = None
    opened_at: datetime | None = None
    failure_reason: str | None = None
    created_at: datetime
    updated_at: datetime | None = None


class NotificationTemplateResponse(BaseModel):
    """Notification template response schema."""

    id: UUID
    name: str
    subject: str | None = None
    body: str
    channel: str
    variables: list[str] | None = None
    version: int
    is_active: bool
    created_at: datetime
    updated_at: datetime | None = None


class NotificationPreferencesResponse(BaseModel):
    """Notification preferences response schema."""

    user_id: UUID
    email_enabled: bool
    sms_enabled: bool
    push_enabled: bool
    in_app_enabled: bool
    quiet_hours_start: str | None = None
    quiet_hours_end: str | None = None
    timezone: str
    language: str
    frequency: str


class UnreadCountResponse(BaseModel):
    """Unread count response schema."""

    count: int


class NotificationStatusResponse(BaseModel):
    """Notification status response schema."""

    success: bool
    message: str


# Email schemas
class EmailSendRequest(BaseModel):
    """Email send request schema."""

    to: str
    subject: str
    body: str
    html: str | None = None
    cc: list[str] | None = None
    bcc: list[str] | None = None
    reply_to: str | None = None
    priority: str = "normal"
    attachments: list[dict] | None = None
    metadata: dict | None = None


class EmailSendBulkRequest(BaseModel):
    """Email send bulk request schema."""

    messages: list[dict]


class EmailStatusResponse(BaseModel):
    """Email status response schema."""

    message_id: str
    status: str
    provider: str


class EmailHistoryResponse(BaseModel):
    """Email history response schema."""

    id: UUID
    to: str
    subject: str
    status: str
    provider: str
    created_at: datetime
    sent_at: datetime | None = None


class EmailProvidersResponse(BaseModel):
    """Email providers response schema."""

    providers: list[str]
    default: str


# SMS schemas
class SmsSendRequest(BaseModel):
    """SMS send request schema."""

    to: str
    body: str
    from_number: str | None = None
    priority: str = "normal"
    message_type: str = "transactional"
    unicode: bool = True
    metadata: dict | None = None


class SmsSendBulkRequest(BaseModel):
    """SMS send bulk request schema."""

    messages: list[dict]


class SmsStatusResponse(BaseModel):
    """SMS status response schema."""

    message_id: str
    status: str
    provider: str


class SmsHistoryResponse(BaseModel):
    """SMS history response schema."""

    id: UUID
    to: str
    body: str
    status: str
    provider: str
    created_at: datetime
    sent_at: datetime | None = None


class SmsProvidersResponse(BaseModel):
    """SMS providers response schema."""

    providers: list[str]
    default: str
