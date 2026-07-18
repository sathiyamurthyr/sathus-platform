"""Tests for preferences service."""

import pytest
from datetime import datetime, time
from uuid import UUID

from app.notification.application.preferences_service import (
    CategoryPreference,
    QuietHours,
    NotificationPreferencesManager,
    DEFAULT_TENANT_PREFERENCES,
)
from app.notification.infrastructure.models import NotificationCategory


class TestCategoryPreference:
    """Tests for CategoryPreference."""

    def test_category_preference_creation(self):
        """Test creating a category preference."""
        pref = CategoryPreference(
            category=NotificationCategory.SYSTEM,
            enabled=True,
            channel_overrides={"email": False},
        )
        assert pref.category == NotificationCategory.SYSTEM
        assert pref.enabled is True
        assert pref.channel_overrides == {"email": False}

    def test_category_preference_to_dict(self):
        """Test converting category preference to dict."""
        pref = CategoryPreference(
            category=NotificationCategory.WORKFLOW,
            enabled=False,
            channel_overrides={"sms": True},
        )
        result = pref.to_dict()
        assert result["category"] == "workflow"
        assert result["enabled"] is False
        assert result["channel_overrides"] == {"sms": True}


class TestQuietHours:
    """Tests for QuietHours."""

    def test_quiet_hours_creation(self):
        """Test creating quiet hours."""
        qh = QuietHours(
            start=time(22, 0),
            end=time(7, 0),
            enabled=True,
        )
        assert qh.start == time(22, 0)
        assert qh.end == time(7, 0)
        assert qh.enabled is True

    def test_quiet_hours_disabled(self):
        """Test disabled quiet hours."""
        qh = QuietHours(
            start=time(22, 0),
            end=time(7, 0),
            enabled=False,
        )
        assert qh.is_in_quiet_hours() is False

    def test_quiet_hours_daytime(self):
        """Test quiet hours during day (not in quiet hours)."""
        qh = QuietHours(
            start=time(22, 0),
            end=time(7, 0),
            enabled=True,
        )
        # 12:00 should not be in quiet hours
        check_time = datetime(2024, 1, 1, 12, 0)
        assert qh.is_in_quiet_hours(check_time) is False

    def test_quiet_hours_nighttime(self):
        """Test quiet hours during night (in quiet hours)."""
        qh = QuietHours(
            start=time(22, 0),
            end=time(7, 0),
            enabled=True,
        )
        # 23:00 should be in quiet hours
        check_time = datetime(2024, 1, 1, 23, 0)
        assert qh.is_in_quiet_hours(check_time) is True

    def test_quiet_hours_overnight(self):
        """Test overnight quiet hours."""
        qh = QuietHours(
            start=time(22, 0),
            end=time(7, 0),
            enabled=True,
        )
        # 3:00 should be in quiet hours (overnight)
        check_time = datetime(2024, 1, 1, 3, 0)
        assert qh.is_in_quiet_hours(check_time) is True

    def test_quiet_hours_to_dict(self):
        """Test converting quiet hours to dict."""
        qh = QuietHours(
            start=time(22, 0),
            end=time(7, 0),
            enabled=True,
        )
        result = qh.to_dict()
        assert result["start"] == "22:00:00"
        assert result["end"] == "07:00:00"
        assert result["enabled"] is True


class TestNotificationPreferencesManager:
    """Tests for NotificationPreferencesManager."""

    @pytest.mark.asyncio
    async def test_get_category_preference_no_prefs(self):
        """Test getting category preference when no preferences exist."""
        manager = NotificationPreferencesManager(None)
        pref = await manager.get_category_preference(
            UUID("00000000-0000-0000-0000-000000000001"),
            NotificationCategory.SYSTEM,
        )
        assert pref.category == NotificationCategory.SYSTEM
        assert pref.enabled is True

    @pytest.mark.asyncio
    async def test_is_quiet_hours_no_prefs(self):
        """Test quiet hours check when no preferences exist."""
        manager = NotificationPreferencesManager(None)
        result = await manager.is_quiet_hours(
            UUID("00000000-0000-0000-0000-000000000001"),
        )
        assert result is False

    @pytest.mark.asyncio
    async def test_should_send_notification_no_prefs(self):
        """Test should send when no preferences exist."""
        manager = NotificationPreferencesManager(None)
        result = await manager.should_send_notification(
            UUID("00000000-0000-0000-0000-000000000001"),
            NotificationCategory.SYSTEM,
            "email",
        )
        assert result is True

    @pytest.mark.asyncio
    async def test_get_digest_preferences_no_prefs(self):
        """Test getting digest preferences when no preferences exist."""
        manager = NotificationPreferencesManager(None)
        result = await manager.get_digest_preferences(
            UUID("00000000-0000-0000-0000-000000000001"),
        )
        assert result["frequency"] == "immediate"
        assert result["enabled"] is True


class TestDefaultTenantPreferences:
    """Tests for default tenant preferences."""

    def test_default_preferences_exist(self):
        """Test that default preferences are defined."""
        assert "email_enabled" in DEFAULT_TENANT_PREFERENCES
        assert "sms_enabled" in DEFAULT_TENANT_PREFERENCES
        assert "push_enabled" in DEFAULT_TENANT_PREFERENCES
        assert "in_app_enabled" in DEFAULT_TENANT_PREFERENCES
        assert "timezone" in DEFAULT_TENANT_PREFERENCES
        assert "language" in DEFAULT_TENANT_PREFERENCES
        assert "frequency" in DEFAULT_TENANT_PREFERENCES

    def test_default_preferences_values(self):
        """Test default preferences values."""
        assert DEFAULT_TENANT_PREFERENCES["email_enabled"] is True
        assert DEFAULT_TENANT_PREFERENCES["sms_enabled"] is True
        assert DEFAULT_TENANT_PREFERENCES["push_enabled"] is True
        assert DEFAULT_TENANT_PREFERENCES["in_app_enabled"] is True
        assert DEFAULT_TENANT_PREFERENCES["timezone"] == "UTC"
        assert DEFAULT_TENANT_PREFERENCES["language"] == "en"
        assert DEFAULT_TENANT_PREFERENCES["frequency"] == "immediate"

    def test_default_category_preferences(self):
        """Test default category preferences."""
        cat_prefs = DEFAULT_TENANT_PREFERENCES["category_preferences"]
        assert "system" in cat_prefs
        assert "user" in cat_prefs
        assert "workflow" in cat_prefs
        assert "alert" in cat_prefs
        assert "marketing" in cat_prefs
        # Marketing should be disabled by default
        assert cat_prefs["marketing"]["enabled"] is False