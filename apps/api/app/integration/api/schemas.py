"""Integration Hub API schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.integration.domain.models import (
    ConnectorType,
    IntegrationStatus,
    SyncDirection,
    SyncType,
    JobStatus,
    AuthType,
)


class ConnectorResponse(BaseModel):
    """Connector response schema."""

    id: UUID
    name: str
    description: str | None = None
    connector_type: str
    base_url: str | None = None
    is_active: bool
    status: str
    created_at: datetime
    updated_at: datetime | None = None


class ConnectorCreate(BaseModel):
    """Connector create schema."""

    name: str
    description: str | None = None
    connector_type: ConnectorType
    base_url: str | None = None
    config: dict = Field(default_factory=dict)
    auth_type: AuthType | None = None
    auth_config: dict = Field(default_factory=dict)
    headers: dict = Field(default_factory=dict)


class IntegrationResponse(BaseModel):
    """Integration response schema."""

    id: UUID
    name: str
    description: str | None = None
    connector_id: UUID
    source_system: str
    target_system: str
    sync_direction: str
    sync_type: str
    is_active: bool
    status: str
    last_sync_at: datetime | None = None
    next_sync_at: datetime | None = None
    created_at: datetime
    updated_at: datetime | None = None


class IntegrationCreate(BaseModel):
    """Integration create schema."""

    name: str
    description: str | None = None
    connector_id: UUID
    source_system: str
    target_system: str
    sync_direction: SyncDirection
    sync_type: SyncType
    schedule: str | None = None
    mapping_config: dict = Field(default_factory=dict)
    transformation_config: dict = Field(default_factory=dict)


class WebhookResponse(BaseModel):
    """Webhook response schema."""

    id: UUID
    name: str
    url: str
    events: list[str]
    is_active: bool
    retry_count: int
    max_retries: int
    created_at: datetime
    updated_at: datetime | None = None


class WebhookCreate(BaseModel):
    """Webhook create schema."""

    name: str
    url: str
    events: list[str] = Field(default_factory=list)
    secret: str | None = None
    headers: dict = Field(default_factory=dict)


class EventBusMessageResponse(BaseModel):
    """Event bus message response schema."""

    id: UUID
    topic: str
    event_type: str
    source: str
    target: str | None = None
    correlation_id: str | None = None
    trace_id: str | None = None
    is_processed: bool
    created_at: datetime


class EventBusMessageCreate(BaseModel):
    """Event bus message create schema."""

    topic: str
    event_type: str
    payload: dict = Field(default_factory=dict)
    source: str
    target: str | None = None
    correlation_id: str | None = None
    trace_id: str | None = None