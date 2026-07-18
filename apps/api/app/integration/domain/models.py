"""Integration Hub domain models."""

from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field


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


class Connector(BaseModel):
    """Connector domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    description: str | None = None
    connector_type: ConnectorType
    base_url: str | None = None
    config: dict = Field(default_factory=dict)
    auth_type: AuthType | None = None
    auth_config: dict = Field(default_factory=dict)
    headers: dict = Field(default_factory=dict)
    is_active: bool = True
    status: IntegrationStatus = IntegrationStatus.ACTIVE
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class Integration(BaseModel):
    """Integration domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
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
    is_active: bool = True
    status: IntegrationStatus = IntegrationStatus.ACTIVE
    last_sync_at: datetime | None = None
    next_sync_at: datetime | None = None
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class IntegrationJob(BaseModel):
    """Integration job domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    integration_id: UUID
    job_type: str
    status: JobStatus = JobStatus.PENDING
    records_processed: int = 0
    records_total: int = 0
    error_message: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))


class Webhook(BaseModel):
    """Webhook domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    url: str
    events: list[str] = Field(default_factory=list)
    secret: str | None = None
    headers: dict = Field(default_factory=dict)
    is_active: bool = True
    retry_count: int = 0
    max_retries: int = 3
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class WebhookDelivery(BaseModel):
    """Webhook delivery domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    webhook_id: UUID
    event: str
    payload: dict = Field(default_factory=dict)
    response_status: int | None = None
    response_body: str | None = None
    error_message: str | None = None
    attempt_number: int = 1
    delivered_at: datetime | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))


class EventBusMessage(BaseModel):
    """Event bus message domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    topic: str
    event_type: str
    payload: dict = Field(default_factory=dict)
    source: str
    target: str | None = None
    correlation_id: str | None = None
    trace_id: str | None = None
    is_processed: bool = False
    processed_at: datetime | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))


class DataMapping(BaseModel):
    """Data mapping domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    source_connector_id: UUID
    target_connector_id: UUID
    field_mappings: dict = Field(default_factory=dict)
    validation_rules: dict = Field(default_factory=dict)
    is_active: bool = True
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class OAuthToken(BaseModel):
    """OAuth token domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    connector_id: UUID
    provider: str
    access_token: str
    refresh_token: str | None = None
    token_type: str = "Bearer"
    expires_at: datetime | None = None
    scope: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None