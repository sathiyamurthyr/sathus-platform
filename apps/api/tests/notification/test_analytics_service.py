"""Tests for analytics service."""

import pytest
from datetime import datetime, time
from uuid import UUID

from app.notification.application.analytics_service import (
    NotificationAnalytics,
    ANALYTICS_EVENTS,
)
from app.notification.infrastructure.models import NotificationCategory


class TestNotificationAnalytics:
    """Tests for NotificationAnalytics."""

    @pytest.mark.asyncio
    async def test_get_delivery_metrics_no_repo(self):
        """Test delivery metrics with no repository."""
        analytics = NotificationAnalytics(None)
        result = await analytics.get_delivery_metrics()
        assert result["total_sent"] == 0
        assert result["delivery_rate"] == 0.0

    @pytest.mark.asyncio
    async def test_get_channel_metrics_no_repo(self):
        """Test channel metrics with no repository."""
        analytics = NotificationAnalytics(None)
        result = await analytics.get_channel_metrics()
        assert result == {}

    @pytest.mark.asyncio
    async def test_get_category_metrics_no_repo(self):
        """Test category metrics with no repository."""
        analytics = NotificationAnalytics(None)
        result = await analytics.get_category_metrics()
        assert result == {}

    @pytest.mark.asyncio
    async def test_get_hourly_metrics_no_repo(self):
        """Test hourly metrics with no repository."""
        analytics = NotificationAnalytics(None)
        result = await analytics.get_hourly_metrics()
        assert result == []


class TestAnalyticsEvents:
    """Tests for analytics events."""

    def test_analytics_events_exist(self):
        """Test that analytics events are defined."""
        assert "notification_sent" in ANALYTICS_EVENTS
        assert "notification_delivered" in ANALYTICS_EVENTS
        assert "notification_opened" in ANALYTICS_EVENTS
        assert "notification_failed" in ANALYTICS_EVENTS
        assert "template_used" in ANALYTICS_EVENTS
        assert "preference_changed" in ANALYTICS_EVENTS

    def test_analytics_events_values(self):
        """Test analytics events values."""
        assert ANALYTICS_EVENTS["notification_sent"] == "Notification was sent"
        assert ANALYTICS_EVENTS["notification_delivered"] == "Notification was delivered"
        assert ANALYTICS_EVENTS["notification_opened"] == "Notification was opened"