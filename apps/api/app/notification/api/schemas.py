"""Notification API schemas."""

from datetime import datetime
from typing import Any
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
    metadata: dict[str, Any] | None = None


class DirectSendRequest(BaseModel):
    """Direct notification dispatch request schema across channels/providers."""

    channel: str = Field(..., description="Target channel (email, sms, push, webhook, in_app)")
    destination: str = Field(..., description="Recipient email, phone number, device token, or webhook URL")
    body: str = Field(..., description="Message body or rendered content")
    subject: str | None = Field(None, description="Optional subject or alert title")
    provider_name: str | None = Field(None, description="Optional provider override")
    metadata: dict[str, Any] | None = Field(None, description="Optional metadata payload")


class DirectSendResponse(BaseModel):
    """Direct notification dispatch response schema."""

    success: bool
    channel: str
    provider: str
    message_id: str
    destination: str


class ProviderTestRequest(BaseModel):
    """Provider test request schema."""

    channel: str = Field(..., description="Channel name (email, sms, push)")
    provider_name: str = Field(..., description="Provider adapter name (smtp, ses, sendgrid, twilio, fcm, etc.)")


class ProviderTestResponse(BaseModel):
    """Provider test response schema."""

    success: bool
    channel: str
    provider_name: str
    status: str
    message: str


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
    created_at: datetime | None = None
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
    created_at: datetime | None = None
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
    attachments: list[dict[str, Any]] | None = None
    metadata: dict[str, Any] | None = None


class EmailSendBulkRequest(BaseModel):
    """Email send bulk request schema."""

    messages: list[dict[str, Any]]


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
    metadata: dict[str, Any] | None = None


class SmsSendBulkRequest(BaseModel):
    """SMS send bulk request schema."""

    messages: list[dict[str, Any]]


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


# Phase 3 Queue & Worker Schemas
class JobResponse(BaseModel):
    """Notification queue job response schema."""

    job_id: UUID
    notification_id: UUID
    queue_name: str
    status: str
    priority: str
    attempts: int
    max_retries: int
    scheduled_at: datetime | None = None
    created_at: datetime | None = None


class JobListResponse(BaseModel):
    """List of notification jobs response schema."""

    jobs: list[JobResponse]
    total: int


class QueueStatsResponse(BaseModel):
    """Queue depth and throughput metrics summary response schema."""

    queues: dict[str, Any]
    total_queued: int
    total_dlq: int


class WorkerStatusResponse(BaseModel):
    """Worker status report schema."""

    worker_id: str
    worker_type: str
    hostname: str
    status: str
    active_jobs_count: int
    processed_jobs_count: int
    failed_jobs_count: int
    last_heartbeat: str


class QueueControlRequest(BaseModel):
    """Queue pause/resume control request schema."""

    queue_name: str = Field(..., description="Target queue name (critical, high, normal, low, all)")


class DLQItemResponse(BaseModel):
    """Dead Letter Queue item summary schema."""

    notification_id: str
    reason: str
    failed_at: str
    payload: dict[str, Any]


class BatchDispatchRequest(BaseModel):
    """Bulk notification batch dispatch request schema."""

    channel: str = Field(..., description="Notification channel (email, sms, push)")
    recipients: list[dict[str, Any]] = Field(..., description="List of recipient maps containing destination, email, phone, or token")
    body: str = Field(..., description="Message body template")
    subject: str | None = Field(None, description="Optional subject")
    priority: str = Field("normal", description="Batch priority")


class BatchDispatchResponse(BaseModel):
    """Bulk notification batch dispatch response schema."""

    batch_id: UUID
    channel: str
    total_recipients: int
    processed_count: int
    failed_count: int
    status: str

