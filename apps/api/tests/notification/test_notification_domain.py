"""Tests for notification domain models and exceptions."""

import pytest
from datetime import datetime
from uuid import uuid4

from app.notification.domain.models import (
    Notification,
    NotificationChannel,
    NotificationStatus,
    NotificationPriority,
    NotificationType,
    NotificationCategory,
    NotificationRecipient,
    NotificationSender,
    NotificationTemplate,
    NotificationPreferences,
)
from app.notification.domain.exceptions import (
    NotificationError,
    NotificationValidationError,
    NotificationNotFoundError,
    InvalidNotificationStatusError,
    SchedulingError,
    NotificationRepositoryError,
)


class TestNotificationChannel:
    """Tests for NotificationChannel enum."""

    def test_channel_values(self):
        """Test channel enum values."""
        assert NotificationChannel.IN_APP == "in_app"
        assert NotificationChannel.EMAIL == "email"
        assert NotificationChannel.SMS == "sms"
        assert NotificationChannel.PUSH == "push"
        assert NotificationChannel.WEBHOOK == "webhook"


class TestNotificationStatus:
    """Tests for NotificationStatus enum."""

    def test_status_values(self):
        """Test status enum values."""
        assert NotificationStatus.DRAFT == "draft"
        assert NotificationStatus.PENDING == "pending"
        assert NotificationStatus.QUEUED == "queued"
        assert NotificationStatus.SCHEDULED == "scheduled"
        assert NotificationStatus.SENDING == "sending"
        assert NotificationStatus.SENT == "sent"
        assert NotificationStatus.DELIVERED == "delivered"
        assert NotificationStatus.READ == "read"
        assert NotificationStatus.FAILED == "failed"
        assert NotificationStatus.CANCELLED == "cancelled"
        assert NotificationStatus.EXPIRED == "expired"
        assert NotificationStatus.ARCHIVED == "archived"


class TestNotificationPriority:
    """Tests for NotificationPriority enum."""

    def test_priority_values(self):
        """Test priority enum values."""
        assert NotificationPriority.LOW == "low"
        assert NotificationPriority.NORMAL == "normal"
        assert NotificationPriority.HIGH == "high"
        assert NotificationPriority.CRITICAL == "critical"


class TestNotificationType:
    """Tests for NotificationType enum."""

    def test_type_values(self):
        """Test type enum values."""
        assert NotificationType.SYSTEM == "system"
        assert NotificationType.SECURITY == "security"
        assert NotificationType.WORKFLOW == "workflow"
        assert NotificationType.CONTENT == "content"
        assert NotificationType.MEDIA == "media"
        assert NotificationType.MARKETING == "marketing"
        assert NotificationType.REMINDER == "reminder"
        assert NotificationType.ALERT == "alert"
        assert NotificationType.ANNOUNCEMENT == "announcement"
        assert NotificationType.CUSTOM == "custom"


class TestNotificationRecipient:
    """Tests for NotificationRecipient value object."""

    def test_recipient_creation(self):
        """Test creating a recipient."""
        recipient = NotificationRecipient(
            user_id=uuid4(),
            channel=NotificationChannel.EMAIL,
            destination="test@example.com",
        )
        assert recipient.channel == NotificationChannel.EMAIL
        assert recipient.destination == "test@example.com"


class TestNotificationSender:
    """Tests for NotificationSender value object."""

    def test_sender_creation(self):
        """Test creating a sender."""
        sender = NotificationSender(
            user_id=uuid4(),
            name="Test User",
            email="sender@example.com",
        )
        assert sender.name == "Test User"
        assert sender.email == "sender@example.com"


class TestNotificationTemplate:
    """Tests for NotificationTemplate value object."""

    def test_template_creation(self):
        """Test creating a template."""
        template = NotificationTemplate(
            id=uuid4(),
            name="Welcome Email",
            subject="Welcome!",
            body="Hello {{name}}!",
            channel=NotificationChannel.EMAIL,
            variables=["name"],
        )
        assert template.name == "Welcome Email"
        assert template.is_active is True


class TestNotification:
    """Tests for Notification aggregate root."""

    def test_notification_creation(self):
        """Test creating a notification."""
        notification = Notification(
            id=uuid4(),
            type=NotificationType.SYSTEM,
            category=NotificationCategory.SYSTEM,
            priority=NotificationPriority.NORMAL,
            recipient=NotificationRecipient(
                user_id=uuid4(),
                channel=NotificationChannel.IN_APP,
            ),
            subject="Test Subject",
            body="Test Body",
            created_at=datetime.now(),
        )
        assert notification.type == NotificationType.SYSTEM
        assert notification.status == NotificationStatus.DRAFT
        assert notification.priority == NotificationPriority.NORMAL


class TestNotificationPreferences:
    """Tests for NotificationPreferences value object."""

    def test_preferences_creation(self):
        """Test creating preferences."""
        prefs = NotificationPreferences(
            user_id=uuid4(),
            email_enabled=True,
            timezone="UTC",
        )
        assert prefs.email_enabled is True
        assert prefs.timezone == "UTC"


class TestNotificationExceptions:
    """Tests for notification exceptions."""

    def test_notification_error(self):
        """Test base notification error."""
        error = NotificationError("Test error")
        assert "Test error" in str(error)

    def test_validation_error(self):
        """Test validation error."""
        error = NotificationValidationError("Invalid data")
        assert "Invalid data" in str(error)

    def test_not_found_error(self):
        """Test not found error."""
        error = NotificationNotFoundError("Not found")
        assert "Not found" in str(error)

    def test_invalid_status_error(self):
        """Test invalid status error."""
        error = InvalidNotificationStatusError("Invalid status")
        assert "Invalid status" in str(error)

    def test_scheduling_error(self):
        """Test scheduling error."""
        error = SchedulingError("Schedule failed")
        assert "Schedule failed" in str(error)

    def test_repository_error(self):
        """Test repository error."""
        error = NotificationRepositoryError("Repo failed")
        assert "Repo failed" in str(error)