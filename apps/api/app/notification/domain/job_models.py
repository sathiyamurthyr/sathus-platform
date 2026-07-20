"""Domain models for Notification Queue Jobs, State Transitions, and Worker metrics."""

from datetime import datetime
from enum import Enum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class JobPriority(str, Enum):
    """Queue priority levels."""

    CRITICAL = "critical"
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"


class JobState(str, Enum):
    """Complete job lifecycle state machine."""

    QUEUED = "queued"
    SCHEDULED = "scheduled"
    PROCESSING = "processing"
    COMPLETED = "completed"
    DELIVERED = "delivered"
    FAILED = "failed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    RETRY_PENDING = "retry_pending"
    MOVED_TO_DLQ = "moved_to_dlq"


class NotificationJobPayload(BaseModel):
    """Data payload for enqueued notification dispatch jobs."""

    model_config = ConfigDict(frozen=True)

    job_id: UUID
    notification_id: UUID
    tenant_id: UUID | None = None
    channel: str
    destination: str
    subject: str | None = None
    body: str
    priority: JobPriority = JobPriority.NORMAL
    provider_name: str | None = None
    attempts: int = 0
    max_retries: int = 3
    created_at: datetime = Field(default_factory=datetime.utcnow)
    scheduled_at: datetime | None = None
    job_metadata: dict[str, Any] = Field(default_factory=dict)


class JobStateTransition(BaseModel):
    """Job state transition log record."""

    model_config = ConfigDict(frozen=True)

    job_id: UUID
    from_state: JobState | None = None
    to_state: JobState
    worker_id: str | None = None
    details: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class QueueStats(BaseModel):
    """Statistics summary across notification queues."""

    model_config = ConfigDict(frozen=True)

    queue_name: str
    queued_count: int = 0
    scheduled_count: int = 0
    processing_count: int = 0
    completed_count: int = 0
    failed_count: int = 0
    dlq_count: int = 0
    is_paused: bool = False


class RateLimitRule(BaseModel):
    """Rate limit configuration rule."""

    model_config = ConfigDict(frozen=True)

    key: str
    limit: int
    window_seconds: int = 60
    burst_allowance: int = 10


class BatchDispatchJob(BaseModel):
    """Bulk batch dispatch job summary."""

    model_config = ConfigDict(frozen=True)

    batch_id: UUID
    tenant_id: UUID | None = None
    channel: str
    total_recipients: int
    processed_count: int = 0
    failed_count: int = 0
    status: str = "in_progress"
    created_at: datetime = Field(default_factory=datetime.utcnow)
