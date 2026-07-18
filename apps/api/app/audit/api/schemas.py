"""Audit API schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.audit.domain.models import AuditEventType, AuditSeverity


class AuditEventResponse(BaseModel):
    """Audit event response schema."""

    id: UUID
    event_type: str
    severity: str
    user_id: UUID | None = None
    tenant_id: UUID | None = None
    resource_id: UUID | None = None
    resource_type: str | None = None
    action: str
    description: str
    metadata: dict = Field(default_factory=dict)
    ip_address: str | None = None
    user_agent: str | None = None
    correlation_id: str | None = None
    created_at: datetime


class AuditEventCreate(BaseModel):
    """Audit event create schema."""

    event_type: AuditEventType
    action: str
    description: str
    severity: AuditSeverity = AuditSeverity.INFO
    user_id: UUID | None = None
    tenant_id: UUID | None = None
    resource_id: UUID | None = None
    resource_type: str | None = None
    metadata: dict = Field(default_factory=dict)
    ip_address: str | None = None
    user_agent: str | None = None
    correlation_id: str | None = None


class AuditQueryRequest(BaseModel):
    """Audit query request schema."""

    event_types: list[AuditEventType] | None = None
    user_id: UUID | None = None
    tenant_id: UUID | None = None
    severity: AuditSeverity | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    search: str | None = None
    limit: int = 50
    offset: int = 0


class AuditSearchResponse(BaseModel):
    """Audit search response schema."""

    events: list[AuditEventResponse]
    total: int
    limit: int
    offset: int


class AuditStatisticsResponse(BaseModel):
    """Audit statistics response schema."""

    event_type_counts: dict
    severity_counts: dict
    total: int