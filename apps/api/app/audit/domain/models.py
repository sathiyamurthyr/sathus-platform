"""Audit domain models."""

from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field


class AuditEventType(StrEnum):
    """Audit event type enumeration."""

    # User Activity
    USER_LOGIN = "user_login"
    USER_LOGOUT = "user_logout"
    USER_REGISTER = "user_register"
    USER_UPDATE = "user_update"
    USER_DELETE = "user_delete"
    PASSWORD_CHANGE = "password_change"
    MFA_ENABLE = "mfa_enable"
    MFA_DISABLE = "mfa_disable"
    MFA_VERIFY = "mfa_verify"

    # Security Events
    AUTH_FAILURE = "auth_failure"
    AUTH_SUCCESS = "auth_success"
    PERMISSION_CHANGE = "permission_change"
    ROLE_CHANGE = "role_change"
    ACCESS_DENIED = "access_denied"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"

    # Data Events
    DATA_CREATE = "data_create"
    DATA_UPDATE = "data_update"
    DATA_DELETE = "data_delete"
    DATA_READ = "data_read"
    DATA_EXPORT = "data_export"
    DATA_IMPORT = "data_import"

    # System Events
    SYSTEM_STARTUP = "system_startup"
    SYSTEM_SHUTDOWN = "system_shutdown"
    CONFIG_CHANGE = "config_change"
    API_CALL = "api_call"

    # Module Events
    CONTENT_PUBLISH = "content_publish"
    WORKFLOW_START = "workflow_start"
    WORKFLOW_COMPLETE = "workflow_complete"
    WORKFLOW_APPROVE = "workflow_approve"
    NOTIFICATION_SENT = "notification_sent"
    SEARCH_PERFORMED = "search_performed"


class AuditSeverity(StrEnum):
    """Audit severity level enumeration."""

    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class AuditEvent(BaseModel):
    """Audit event aggregate root."""

    id: UUID
    event_type: AuditEventType
    severity: AuditSeverity
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

    class Config:
        """Pydantic config."""

        frozen = True


class AuditQuery(BaseModel):
    """Audit query value object."""

    event_types: list[AuditEventType] | None = None
    user_id: UUID | None = None
    tenant_id: UUID | None = None
    severity: AuditSeverity | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    search: str | None = None
    limit: int = 50
    offset: int = 0

    class Config:
        """Pydantic config."""

        frozen = True


class AuditLog(BaseModel):
    """Audit log value object for read operations."""

    id: UUID
    event_type: AuditEventType
    severity: AuditSeverity
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

    class Config:
        """Pydantic config."""

        frozen = True