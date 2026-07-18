"""Integration Hub database models."""

from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    String,
    Text,
    Boolean,
    Integer,
    func,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID

from app.core.database import Base


class ConnectorType(str, Enum):
    """Connector type enumeration."""

    REST = "rest"
    GRAPHQL = "graphql"
    SOAP = "soap"
    WEBHOOK = "webhook"
    SFTP = "sftp"
    DATABASE = "database"
    MESSAGE_QUEUE = "message_queue"


class IntegrationStatus(str, Enum):
    """Integration status enumeration."""

    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"
    CONNECTING = "connecting"
    DISCONNECTING = "disconnecting"


class SyncDirection(str, Enum):
    """Synchronization direction enumeration."""

    ONE_WAY = "one_way"
    TWO_WAY = "two_way"


class SyncType(str, Enum):
    """Synchronization type enumeration."""

    INCREMENTAL = "incremental"
    FULL = "full"
    REALTIME = "realtime"


class JobStatus(str, Enum):
    """Job status enumeration."""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    RETRY = "retry"


class AuthType(str, Enum):
    """Authentication type enumeration."""

    API_KEY = "api_key"
    OAUTH2 = "oauth2"
    BASIC = "basic"
    BEARER = "bearer"
    HMAC = "hmac"


class Connector(Base):
    """Connector database model."""

    __tablename__ = "integration_connectors"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    connector_type = Column(SQLEnum(ConnectorType), nullable=False)
    base_url = Column(String(500), nullable=True)
    config = Column(Text, nullable=False, default="{}")  # JSON
    auth_type = Column(SQLEnum(AuthType), nullable=True)
    auth_config = Column(Text, nullable=False, default="{}")  # JSON
    headers = Column(Text, nullable=False, default="{}")  # JSON
    is_active = Column(Boolean, nullable=False, default=True)
    status = Column(SQLEnum(IntegrationStatus), nullable=False, default=IntegrationStatus.ACTIVE)
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Integration(Base):
    """Integration database model."""

    __tablename__ = "integrations"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    connector_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("integration_connectors.id"),
        nullable=False,
    )
    source_system = Column(String(255), nullable=False)
    target_system = Column(String(255), nullable=False)
    sync_direction = Column(SQLEnum(SyncDirection), nullable=False)
    sync_type = Column(SQLEnum(SyncType), nullable=False)
    schedule = Column(String(100), nullable=True)
    mapping_config = Column(Text, nullable=False, default="{}")  # JSON
    transformation_config = Column(Text, nullable=False, default="{}")  # JSON
    is_active = Column(Boolean, nullable=False, default=True)
    status = Column(SQLEnum(IntegrationStatus), nullable=False, default=IntegrationStatus.ACTIVE)
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    next_sync_at = Column(DateTime(timezone=True), nullable=True)
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class IntegrationJob(Base):
    """Integration job database model."""

    __tablename__ = "integration_jobs"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    integration_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("integrations.id"),
        nullable=False,
    )
    job_type = Column(String(100), nullable=False)
    status = Column(SQLEnum(JobStatus), nullable=False, default=JobStatus.PENDING)
    records_processed = Column(Integer, nullable=False, default=0)
    records_total = Column(Integer, nullable=False, default=0)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Webhook(Base):
    """Webhook database model."""

    __tablename__ = "integration_webhooks"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    events = Column(Text, nullable=False, default="[]")  # JSON array
    secret = Column(Text, nullable=True)
    headers = Column(Text, nullable=False, default="{}")  # JSON
    is_active = Column(Boolean, nullable=False, default=True)
    retry_count = Column(Integer, nullable=False, default=0)
    max_retries = Column(Integer, nullable=False, default=3)
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class WebhookDelivery(Base):
    """Webhook delivery database model."""

    __tablename__ = "integration_webhook_deliveries"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    webhook_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("integration_webhooks.id"),
        nullable=False,
    )
    event = Column(String(255), nullable=False)
    payload = Column(Text, nullable=False, default="{}")  # JSON
    response_status = Column(Integer, nullable=True)
    response_body = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    attempt_number = Column(Integer, nullable=False, default=1)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class EventBusMessage(Base):
    """Event bus message database model."""

    __tablename__ = "integration_event_bus_messages"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    topic = Column(String(255), nullable=False)
    event_type = Column(String(255), nullable=False)
    payload = Column(Text, nullable=False, default="{}")  # JSON
    source = Column(String(255), nullable=False)
    target = Column(String(255), nullable=True)
    correlation_id = Column(String(255), nullable=True)
    trace_id = Column(String(255), nullable=True)
    is_processed = Column(Boolean, nullable=False, default=False)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class DataMapping(Base):
    """Data mapping database model."""

    __tablename__ = "integration_data_mappings"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    source_connector_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("integration_connectors.id"),
        nullable=False,
    )
    target_connector_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("integration_connectors.id"),
        nullable=False,
    )
    field_mappings = Column(Text, nullable=False, default="{}")  # JSON
    validation_rules = Column(Text, nullable=False, default="{}")  # JSON
    is_active = Column(Boolean, nullable=False, default=True)
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class OAuthToken(Base):
    """OAuth token database model."""

    __tablename__ = "integration_oauth_tokens"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    connector_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("integration_connectors.id"),
        nullable=False,
    )
    provider = Column(String(255), nullable=False)
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=True)
    token_type = Column(String(50), nullable=False, default="Bearer")
    expires_at = Column(DateTime(timezone=True), nullable=True)
    scope = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())