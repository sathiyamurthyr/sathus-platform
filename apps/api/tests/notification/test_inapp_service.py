"""Tests for in-app notification service."""

import pytest
from datetime import datetime
from uuid import UUID

from app.notification.application.inapp_service import (
    InAppNotificationService,
    RealTimeNotificationService,
    NotificationAction,
    NotificationCounter,
)
from app.notification.domain.inapp_exceptions import (
    NotificationNotFoundError,
    BulkOperationError,
    SearchError,
)


class TestNotificationAction:
    """Tests for NotificationAction."""

    def test_action_constants(self):
        """Test action constants exist."""
        assert NotificationAction.READ == "read"
        assert NotificationAction.UNREAD == "unread"
        assert NotificationAction.ARCHIVE == "archive"
        assert NotificationAction.DELETE == "delete"
        assert NotificationAction.PIN == "pin"
        assert NotificationAction.UNPIN == "unpin"
        assert NotificationAction.SNOOZE == "snooze"
        assert NotificationAction.RESTORE == "restore"


class TestNotificationCounter:
    """Tests for NotificationCounter."""

    def test_counter_creation(self):
        """Test creating a notification counter."""
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        counter = NotificationCounter(user_id=user_id)
        assert counter.user_id == user_id
        assert counter.total == 0
        assert counter.unread == 0

    def test_counter_to_dict(self):
        """Test converting counter to dict."""
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        counter = NotificationCounter(user_id=user_id)
        result = counter.to_dict()
        assert "user_id" in result
        assert "total" in result


class TestInAppNotificationService:
    """Tests for InAppNotificationService."""

    @pytest.mark.asyncio
    async def test_get_inbox(self):
        """Test getting inbox."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        result = await service.get_inbox(user_id=user_id)
        assert result == []

    @pytest.mark.asyncio
    async def test_get_unread(self):
        """Test getting unread notifications."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        result = await service.get_unread(user_id=user_id)
        assert result == []

    @pytest.mark.asyncio
    async def test_get_notification_not_found(self):
        """Test getting non-existent notification."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_id = UUID("00000000-0000-0000-0000-000000000002")
        with pytest.raises(NotificationNotFoundError):
            await service.get_notification(notification_id, user_id)

    @pytest.mark.asyncio
    async def test_mark_as_read(self):
        """Test marking notification as read."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_id = UUID("00000000-0000-0000-0000-000000000002")
        result = await service.mark_as_read(notification_id, user_id)
        assert result is True

    @pytest.mark.asyncio
    async def test_mark_as_unread(self):
        """Test marking notification as unread."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_id = UUID("00000000-0000-0000-0000-000000000002")
        result = await service.mark_as_unread(notification_id, user_id)
        assert result is True

    @pytest.mark.asyncio
    async def test_archive(self):
        """Test archiving notification."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_id = UUID("00000000-0000-0000-0000-000000000002")
        result = await service.archive(notification_id, user_id)
        assert result is True

    @pytest.mark.asyncio
    async def test_delete(self):
        """Test deleting notification."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_id = UUID("00000000-0000-0000-0000-000000000002")
        result = await service.delete(notification_id, user_id)
        assert result is True

    @pytest.mark.asyncio
    async def test_pin(self):
        """Test pinning notification."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_id = UUID("00000000-0000-0000-0000-000000000002")
        result = await service.pin(notification_id, user_id)
        assert result is True

    @pytest.mark.asyncio
    async def test_unpin(self):
        """Test unpinning notification."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_id = UUID("00000000-0000-0000-0000-000000000002")
        result = await service.unpin(notification_id, user_id)
        assert result is True

    @pytest.mark.asyncio
    async def test_snooze(self):
        """Test snoozing notification."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_id = UUID("00000000-0000-0000-0000-000000000002")
        snooze_until = datetime.now()
        result = await service.snooze(notification_id, user_id, snooze_until)
        assert result is True

    @pytest.mark.asyncio
    async def test_restore(self):
        """Test restoring notification."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_id = UUID("00000000-0000-0000-0000-000000000002")
        result = await service.restore(notification_id, user_id)
        assert result is True

    @pytest.mark.asyncio
    async def test_bulk_action_valid(self):
        """Test valid bulk action."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_ids = [UUID("00000000-0000-0000-0000-000000000002")]
        result = await service.bulk_action(notification_ids, "read", user_id)
        assert result == 1

    @pytest.mark.asyncio
    async def test_bulk_action_invalid(self):
        """Test invalid bulk action."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        notification_ids = [UUID("00000000-0000-0000-0000-000000000002")]
        with pytest.raises(BulkOperationError):
            await service.bulk_action(notification_ids, "invalid", user_id)

    @pytest.mark.asyncio
    async def test_get_counts(self):
        """Test getting notification counts."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        result = await service.get_counts(user_id)
        assert isinstance(result, NotificationCounter)

    @pytest.mark.asyncio
    async def test_search_no_query(self):
        """Test search without query."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        with pytest.raises(SearchError):
            await service.search(user_id, query="")

    @pytest.mark.asyncio
    async def test_search_with_query(self):
        """Test search with query."""
        service = InAppNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        result = await service.search(user_id, query="test")
        assert result == []


class TestRealTimeNotificationService:
    """Tests for RealTimeNotificationService."""

    @pytest.mark.asyncio
    async def test_get_unread_count_without_redis(self):
        """Test getting unread count without Redis."""
        service = RealTimeNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        result = await service.get_unread_count(user_id)
        assert result == 0

    @pytest.mark.asyncio
    async def test_increment_unread_count_without_redis(self):
        """Test incrementing unread count without Redis."""
        service = RealTimeNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        result = await service.increment_unread_count(user_id)
        assert result == 0

    @pytest.mark.asyncio
    async def test_decrement_unread_count_without_redis(self):
        """Test decrementing unread count without Redis."""
        service = RealTimeNotificationService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        result = await service.decrement_unread_count(user_id)
        assert result == 0