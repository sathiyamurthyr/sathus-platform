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


class NotificationStatus(str, Enum):
    """Notification status enumeration."""

    PENDING = "pending"
    QUEUED = "queued"
    SENT = "sent"
    DELIVERED = "delivered"
    OPENED = "opened"
    FAILED = "failed"
    CANCELLED = "cancelled"


class NotificationPriority(str, Enum):
    """Notification priority enumeration."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"


class NotificationCategory(str, Enum):
    """Notification category enumeration."""

    SYSTEM = "system"
    USER = "user"
    WORKFLOW = "workflow"
    ALERT = "alert"
    MARKETING = "marketing"


class NotificationTemplate(Base):
    """Notification template database model."""

    __tablename__ = "notification_templates"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False, unique=True)
    subject = Column(String(255), nullable=True)
    body = Column(Text, nullable=False)
    channel = Column(SQLEnum(NotificationChannel), nullable=False)
    variables = Column(Text, nullable=True)  # JSON array of variable names
    version = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Notification(Base):
    """Notification database model."""

    __tablename__ = "notifications"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
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
    category = Column(SQLEnum(NotificationCategory), nullable=False)
    priority = Column(SQLEnum(NotificationPriority), default=NotificationPriority.NORMAL)
    channel = Column(SQLEnum(NotificationChannel), nullable=False)
    subject = Column(String(255), nullable=True)
    body = Column(Text, nullable=False)
    status = Column(SQLEnum(NotificationStatus), default=NotificationStatus.PENDING)
    destination = Column(String(500), nullable=True)  # email, phone, device token, webhook URL
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    opened_at = Column(DateTime(timezone=True), nullable=True)
    failure_reason = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    notification_metadata = Column(Text, nullable=True)  # JSON object
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    template = relationship("NotificationTemplate", backref="notifications")


class NotificationTemplateLocalization(Base):
    """Notification template localization database model."""

    __tablename__ = "notification_template_localizations"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    template_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("notification_templates.id"),
        nullable=False,
    )
    language_code = Column(String(10), nullable=False)
    subject = Column(String(255), nullable=True)
    body = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class NotificationPreferences(Base):
    """User notification preferences database model."""

    __tablename__ = "notification_preferences"
    __allow_unmapped__ = True

    user_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        primary_key=True,
    )
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
