"""Notification tests."""

from datetime import datetime
from uuid import UUID

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.notification.infrastructure.models import (
    Notification,
    NotificationTemplate,
    NotificationPreferences,
    NotificationStatus,
    NotificationChannel,
    NotificationPriority,
    NotificationCategory,
)
from app.notification.infrastructure.repositories import (
    NotificationRepository,
    NotificationTemplateRepository,
    NotificationPreferencesRepository,
)


class TestNotificationRepository:
    """Test notification repository."""

    async def test_create_notification(self, db: AsyncSession) -> None:
        """Test creating a notification."""
        repo = NotificationRepository(db)
        notification = await repo.create(
            user_id=UUID("00000000-0000-0000-0000-000000000001"),
            category=NotificationCategory.SYSTEM,
            channel=NotificationChannel.IN_APP,
            body="Test notification",
        )

        assert notification.id is not None
        assert notification.user_id == UUID("00000000-0000-0000-0000-000000000001")
        assert notification.category == NotificationCategory.SYSTEM
        assert notification.channel == NotificationChannel.IN_APP
        assert notification.status == NotificationStatus.PENDING

    async def test_get_by_id(self, db: AsyncSession) -> None:
        """Test getting notification by ID."""
        repo = NotificationRepository(db)
        notification = await repo.create(
            user_id=UUID("00000000-0000-0000-0000-000000000001"),
            category=NotificationCategory.SYSTEM,
            channel=NotificationChannel.IN_APP,
            body="Test notification",
        )

        fetched = await repo.get_by_id(notification.id)
        assert fetched is not None
        assert fetched.id == notification.id

    async def test_get_by_user(self, db: AsyncSession) -> None:
        """Test getting notifications by user."""
        repo = NotificationRepository(db)
        user_id = UUID("00000000-0000-0000-0000-000000000001")

        await repo.create(
            user_id=user_id,
            category=NotificationCategory.SYSTEM,
            channel=NotificationChannel.IN_APP,
            body="Test notification 1",
        )
        await repo.create(
            user_id=user_id,
            category=NotificationCategory.USER,
            channel=NotificationChannel.EMAIL,
            body="Test notification 2",
        )

        notifications = await repo.get_by_user(user_id)
        assert len(notifications) == 2


class TestNotificationTemplateRepository:
    """Test notification template repository."""

    async def test_create_template(self, db: AsyncSession) -> None:
        """Test creating a template."""
        repo = NotificationTemplateRepository(db)
        template = await repo.create(
            name="test-template",
            body="Hello {{name}}!",
            channel=NotificationChannel.EMAIL,
            subject="Test Subject",
            variables=["name"],
        )

        assert template.id is not None
        assert template.name == "test-template"
        assert template.channel == NotificationChannel.EMAIL
        assert template.is_active is True

    async def test_get_by_name(self, db: AsyncSession) -> None:
        """Test getting template by name."""
        repo = NotificationTemplateRepository(db)
        template = await repo.create(
            name="test-template",
            body="Hello!",
            channel=NotificationChannel.EMAIL,
        )

        fetched = await repo.get_by_name("test-template")
        assert fetched is not None
        assert fetched.id == template.id


class TestNotificationPreferencesRepository:
    """Test notification preferences repository."""

    async def test_create_preferences(self, db: AsyncSession) -> None:
        """Test creating preferences."""
        repo = NotificationPreferencesRepository(db)
        user_id = UUID("00000000-0000-0000-0000-000000000001")

        prefs = await repo.create_or_update(
            user_id=user_id,
            email_enabled=True,
            sms_enabled=False,
        )

        assert prefs.user_id == user_id
        assert prefs.email_enabled is True
        assert prefs.sms_enabled is False

    async def test_update_preferences(self, db: AsyncSession) -> None:
        """Test updating preferences."""
        repo = NotificationPreferencesRepository(db)
        user_id = UUID("00000000-0000-0000-0000-000000000001")

        # Create initial
        prefs = await repo.create_or_update(
            user_id=user_id,
            email_enabled=True,
        )

        # Update
        prefs = await repo.create_or_update(
            user_id=user_id,
            email_enabled=False,
            sms_enabled=True,
        )

        assert prefs.email_enabled is False
        assert prefs.sms_enabled is True