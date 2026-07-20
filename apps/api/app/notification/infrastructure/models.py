"""Notification database models."""

from enum import Enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy import (
    Enum as SQLEnum,
)
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class NotificationChannel(str, Enum):
    """Notification channel enumeration."""

    IN_APP = "in_app"
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    WEBHOOK = "webhook"


class NotificationProvider(str, Enum):
    """Notification provider enumeration."""

    SENDGRID = "sendgrid"
    SMTP = "smtp"
    AWS_SES = "ses"
    TWILIO = "twilio"
    FCM = "fcm"
    GENERIC_WEBHOOK = "generic_webhook"
    IN_MEMORY = "in_memory"


class NotificationStatus(str, Enum):
    """Notification status enumeration."""

    DRAFT = "draft"
    PENDING = "pending"
    QUEUED = "queued"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"
    DELIVERED = "delivered"
    OPENED = "opened"
    READ = "read"
    FAILED = "failed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    ARCHIVED = "archived"


class NotificationPriority(str, Enum):
    """Notification priority enumeration."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"


class NotificationCategory(str, Enum):
    """Notification category enumeration."""

    SECURITY = "security"
    BILLING = "billing"
    WORKFLOW = "workflow"
    CONTENT = "content"
    MEDIA = "media"
    SYSTEM = "system"
    MARKETING = "marketing"
    USER = "user"
    ALERT = "alert"


class NotificationTemplate(Base):
    """Notification template database model."""

    __tablename__ = "notification_templates"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    subject = Column(String(255), nullable=True)
    body = Column(Text, nullable=False)
    channel = Column(SQLEnum(NotificationChannel), nullable=False, index=True)
    category = Column(SQLEnum(NotificationCategory), default=NotificationCategory.SYSTEM, index=True)
    variables = Column(Text, nullable=True)  # JSON array of variable names
    version = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(PostgresUUID(as_uuid=True), nullable=True)
    updated_by = Column(PostgresUUID(as_uuid=True), nullable=True)


class Notification(Base):
    """Notification database model."""

    __tablename__ = "notifications"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=True, index=True)
    template_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("notification_templates.id"),
        nullable=True,
    )
    user_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    category = Column(SQLEnum(NotificationCategory), nullable=False, index=True)
    priority = Column(SQLEnum(NotificationPriority), default=NotificationPriority.NORMAL)
    channel = Column(SQLEnum(NotificationChannel), nullable=False, index=True)
    subject = Column(String(255), nullable=True)
    body = Column(Text, nullable=False)
    status = Column(SQLEnum(NotificationStatus), default=NotificationStatus.PENDING, index=True)
    destination = Column(String(500), nullable=True)  # email, phone, device token, webhook URL
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    opened_at = Column(DateTime(timezone=True), nullable=True)
    failure_reason = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    is_deleted = Column(Boolean, default=False, index=True)
    notification_metadata = Column(Text, nullable=True)  # JSON object
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(PostgresUUID(as_uuid=True), nullable=True)
    updated_by = Column(PostgresUUID(as_uuid=True), nullable=True)

    template = relationship("NotificationTemplate", backref="notifications")


class NotificationPreferences(Base):
    """User notification preferences database model."""

    __tablename__ = "notification_preferences"
    __allow_unmapped__ = True

    user_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        primary_key=True,
    )
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=True, index=True)
    email_enabled = Column(Boolean, default=True)
    sms_enabled = Column(Boolean, default=True)
    push_enabled = Column(Boolean, default=True)
    in_app_enabled = Column(Boolean, default=True)
    quiet_hours_start = Column(String(10), nullable=True)  # HH:MM format
    quiet_hours_end = Column(String(10), nullable=True)  # HH:MM format
    timezone = Column(String(50), default="UTC")
    language = Column(String(10), default="en")
    frequency = Column(String(20), default="immediate")  # immediate, digest, daily, weekly
    category_preferences = Column(Text, nullable=True)  # JSON object for category-specific settings
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class NotificationHistory(Base):
    """Notification history audit log database model."""

    __tablename__ = "notification_history"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=True, index=True)
    notification_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("notifications.id"),
        nullable=False,
        index=True,
    )
    user_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    channel = Column(SQLEnum(NotificationChannel), nullable=False)
    provider = Column(String(50), nullable=True)
    status = Column(SQLEnum(NotificationStatus), nullable=False)
    event = Column(String(100), nullable=False, index=True)
    details = Column(Text, nullable=True)  # JSON payload
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    created_by = Column(PostgresUUID(as_uuid=True), nullable=True)


class NotificationJobState(str, Enum):
    """Notification job lifecycle state enumeration."""

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


class NotificationJob(Base):
    """Async Notification Job database model."""

    __tablename__ = "notification_jobs"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=True, index=True)
    notification_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("notifications.id"),
        nullable=False,
        index=True,
    )
    queue_name = Column(String(100), nullable=False, default="normal", index=True)
    status = Column(SQLEnum(NotificationJobState), nullable=False, default=NotificationJobState.QUEUED, index=True)
    priority = Column(SQLEnum(NotificationPriority), default=NotificationPriority.NORMAL, index=True)
    attempts = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    scheduled_at = Column(DateTime(timezone=True), nullable=True, index=True)
    run_at = Column(DateTime(timezone=True), nullable=True, index=True)
    locked_by_worker = Column(String(255), nullable=True, index=True)
    locked_at = Column(DateTime(timezone=True), nullable=True)
    payload = Column(Text, nullable=False)  # JSON payload
    job_metadata = Column(Text, nullable=True)  # JSON metadata
    failure_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class NotificationJobHistory(Base):
    """Notification job state transition history database model."""

    __tablename__ = "notification_job_history"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    job_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("notification_jobs.id"),
        nullable=False,
        index=True,
    )
    state = Column(SQLEnum(NotificationJobState), nullable=False, index=True)
    worker_id = Column(String(255), nullable=True)
    details = Column(Text, nullable=True)  # JSON details
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


class WorkerStatus(Base):
    """Background worker status and heartbeat tracking database model."""

    __tablename__ = "worker_status"
    __allow_unmapped__ = True

    worker_id = Column(String(255), primary_key=True)
    worker_type = Column(String(100), nullable=False, index=True)  # email, sms, push, webhook, in_app
    hostname = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="active", index=True)  # active, paused, draining, stopped
    active_jobs_count = Column(Integer, default=0)
    processed_jobs_count = Column(Integer, default=0)
    failed_jobs_count = Column(Integer, default=0)
    last_heartbeat = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class QueueMetrics(Base):
    """Queue performance and depth metrics snapshot database model."""

    __tablename__ = "queue_metrics"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    queue_name = Column(String(100), nullable=False, index=True)
    total_enqueued = Column(Integer, default=0)
    total_processed = Column(Integer, default=0)
    total_failed = Column(Integer, default=0)
    dlq_count = Column(Integer, default=0)
    avg_latency_ms = Column(Integer, default=0)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


class DeliveryAttempt(Base):
    """Provider delivery attempt log database model."""

    __tablename__ = "delivery_attempts"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    job_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("notification_jobs.id"),
        nullable=False,
        index=True,
    )
    provider_name = Column(String(100), nullable=False, index=True)
    status = Column(String(50), nullable=False)  # success, transient_failure, permanent_failure
    response_code = Column(String(50), nullable=True)
    error_message = Column(Text, nullable=True)
    attempt_number = Column(Integer, nullable=False, default=1)
    duration_ms = Column(Integer, nullable=False, default=0)
    worker_id = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

