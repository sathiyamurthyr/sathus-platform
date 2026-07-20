"""Notification domain events and trigger event contracts."""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# --- Notification Lifecycle Events ---

class NotificationCreated(BaseModel):
    """Event emitted when a notification is created."""

    notification_id: UUID
    tenant_id: UUID | None = None
    user_id: UUID
    category: str
    priority: str
    channel: str
    created_at: datetime
    model_config = ConfigDict(frozen=True)


class NotificationQueued(BaseModel):
    """Event emitted when a notification is queued for delivery."""

    notification_id: UUID
    tenant_id: UUID | None = None
    queued_at: datetime
    model_config = ConfigDict(frozen=True)


class NotificationSent(BaseModel):
    """Event emitted when a notification is sent."""

    notification_id: UUID
    tenant_id: UUID | None = None
    sent_at: datetime
    provider: str | None = None
    model_config = ConfigDict(frozen=True)


class NotificationDelivered(BaseModel):
    """Event emitted when a notification is delivered."""

    notification_id: UUID
    tenant_id: UUID | None = None
    delivered_at: datetime
    model_config = ConfigDict(frozen=True)


class NotificationOpened(BaseModel):
    """Event emitted when a notification is opened/read."""

    notification_id: UUID
    tenant_id: UUID | None = None
    opened_at: datetime
    model_config = ConfigDict(frozen=True)


class NotificationFailed(BaseModel):
    """Event emitted when a notification fails to send."""

    notification_id: UUID
    tenant_id: UUID | None = None
    failed_at: datetime
    reason: str
    retry_count: int
    model_config = ConfigDict(frozen=True)


class NotificationCancelled(BaseModel):
    """Event emitted when a notification is cancelled."""

    notification_id: UUID
    tenant_id: UUID | None = None
    cancelled_at: datetime
    reason: str | None = None
    model_config = ConfigDict(frozen=True)


# --- System & Business Trigger Event Contracts ---

class UserRegistered(BaseModel):
    """Event contract for user registration."""

    user_id: UUID
    tenant_id: UUID | None = None
    email: str
    full_name: str | None = None
    registered_at: datetime
    model_config = ConfigDict(frozen=True)


class PasswordReset(BaseModel):
    """Event contract for password reset requests."""

    user_id: UUID
    tenant_id: UUID | None = None
    email: str
    reset_token: str
    requested_at: datetime
    model_config = ConfigDict(frozen=True)


class LoginSuccess(BaseModel):
    """Event contract for successful login."""

    user_id: UUID
    tenant_id: UUID | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    logged_in_at: datetime
    model_config = ConfigDict(frozen=True)


class MediaUploaded(BaseModel):
    """Event contract for media asset uploads."""

    asset_id: UUID
    tenant_id: UUID | None = None
    owner_id: UUID
    file_name: str
    mime_type: str
    file_size_bytes: int
    uploaded_at: datetime
    model_config = ConfigDict(frozen=True)


class ContentPublished(BaseModel):
    """Event contract for published content items."""

    content_id: UUID
    tenant_id: UUID | None = None
    author_id: UUID
    title: str
    slug: str
    published_at: datetime
    model_config = ConfigDict(frozen=True)


class InvoicePaid(BaseModel):
    """Event contract for paid invoices."""

    invoice_id: UUID
    tenant_id: UUID | None = None
    customer_id: UUID
    amount_cents: int
    currency: str = "USD"
    paid_at: datetime
    model_config = ConfigDict(frozen=True)


class SubscriptionActivated(BaseModel):
    """Event contract for activated subscriptions."""

    subscription_id: UUID
    tenant_id: UUID | None = None
    plan_name: str
    activated_at: datetime
    model_config = ConfigDict(frozen=True)


class TaskAssigned(BaseModel):
    """Event contract for assigned workflow tasks."""

    task_id: UUID
    tenant_id: UUID | None = None
    assignee_id: UUID
    assigner_id: UUID
    task_name: str
    due_date: datetime | None = None
    assigned_at: datetime
    model_config = ConfigDict(frozen=True)


class ProjectCreated(BaseModel):
    """Event contract for new project creation."""

    project_id: UUID
    tenant_id: UUID | None = None
    owner_id: UUID
    project_name: str
    created_at: datetime
    model_config = ConfigDict(frozen=True)


# --- Event Publisher Abstract Contract ---

class EventPublisher(ABC):
    """Abstract interface for Event Publisher implementations."""

    @abstractmethod
    async def publish(self, event: BaseModel, topic: str | None = None) -> bool:
        """Publish a domain event to the event bus.

        Args:
            event: Event model payload.
            topic: Optional event topic/channel name.

        Returns:
            True if publish succeeded.
        """
        pass