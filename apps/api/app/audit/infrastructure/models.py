"""Audit database models."""

from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    String,
    Text,
    func,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID

from app.core.database import Base


class AuditEventType(str, Enum):
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


class AuditSeverity(str, Enum):
    """Audit severity level enumeration."""

    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class AuditEvent(Base):
    """Audit event database model."""

    __tablename__ = "audit_events"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    event_type = Column(SQLEnum(AuditEventType), nullable=False)
    severity = Column(SQLEnum(AuditSeverity), nullable=False, default=AuditSeverity.INFO)
    user_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    resource_id = Column(PostgresUUID(as_uuid=True), nullable=True)
    resource_type = Column(String(100), nullable=True)
    action = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    audit_metadata = Column(Text, nullable=True)  # JSON object
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    correlation_id = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())