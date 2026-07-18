"""Enhanced notification preferences service."""

from datetime import datetime, time
from typing import Any
from uuid import UUID

from app.core.logging import logger
from app.notification.infrastructure.models import (
    NotificationPreferences,
    NotificationCategory,
)
from app.notification.infrastructure.repositories import (
    NotificationPreferencesRepository,
)


class CategoryPreference:
    """Category-specific notification preference."""

    def __init__(
        self,
        category: NotificationCategory,
        enabled: bool = True,
        channel_overrides: dict[str, bool] | None = None,
    ):
        """Initialize category preference."""
        self.category = category
        self.enabled = enabled
        self.channel_overrides = channel_overrides or {}

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "category": self.category.value,
            "enabled": self.enabled,
            "channel_overrides": self.channel_overrides,
        }


class QuietHours:
    """Quiet hours configuration."""

    def __init__(
        self,
        start: time,
        end: time,
        enabled: bool = True,
    ):
        """Initialize quiet hours."""
        self.start = start
        self.end = end
        self.enabled = enabled

    def is_in_quiet_hours(self, check_time: datetime | None = None) -> bool:
        """Check if current time is within quiet hours."""
        if not self.enabled:
            return False

        check = check_time or datetime.utcnow()
        current_time = check.time()

        if self.start <= self.end:
            return self.start <= current_time <= self.end
        else:
            # Overnight quiet hours (e.g., 22:00 to 07:00)
            return current_time >= self.start or current_time <= self.end

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "start": self.start.isoformat(),
            "end": self.end.isoformat(),
            "enabled": self.enabled,
        }


class NotificationPreferencesManager:
    """Enhanced notification preferences manager."""

    def __init__(self, preferences_repo: NotificationPreferencesRepository):
        """Initialize preferences manager."""
        self.preferences_repo = preferences_repo

    async def get_preferences(self, user_id: UUID) -> NotificationPreferences | None:
        """Get preferences for a user."""
        return await self.preferences_repo.get_by_user_id(user_id)

    async def get_category_preference(
        self,
        user_id: UUID,
        category: NotificationCategory,
    ) -> CategoryPreference:
        """Get preference for a specific category."""
        if self.preferences_repo is None:
            return CategoryPreference(category=category, enabled=True)

        prefs = await self.preferences_repo.get_by_user_id(user_id)
        if not prefs:
            return CategoryPreference(category=category, enabled=True)

        # Check if category-specific preferences exist
        category_prefs = prefs.category_preferences or {}
        if category.value in category_prefs:
            cat_pref = category_prefs[category.value]
            return CategoryPreference(
                category=category,
                enabled=cat_pref.get("enabled", True),
                channel_overrides=cat_pref.get("channel_overrides", {}),
            )

        return CategoryPreference(category=category, enabled=True)

    async def update_category_preference(
        self,
        user_id: UUID,
        category: NotificationCategory,
        enabled: bool,
        channel_overrides: dict[str, bool] | None = None,
    ) -> NotificationPreferences:
        """Update preference for a specific category."""
        prefs = await self.preferences_repo.get_by_user_id(user_id)
        if not prefs:
            prefs = await self.preferences_repo.create_or_update(
                user_id=user_id,
            )

        if prefs.category_preferences is None:
            prefs.category_preferences = {}

        prefs.category_preferences[category.value] = {
            "enabled": enabled,
            "channel_overrides": channel_overrides or {},
        }

        await self.preferences_repo.session.flush()
        return prefs

    async def is_quiet_hours(self, user_id: UUID) -> bool:
        """Check if user is currently in quiet hours."""
        if self.preferences_repo is None:
            return False

        prefs = await self.preferences_repo.get_by_user_id(user_id)
        if not prefs or not prefs.quiet_hours_start or not prefs.quiet_hours_end:
            return False

        try:
            start = time.fromisoformat(prefs.quiet_hours_start)
            end = time.fromisoformat(prefs.quiet_hours_end)
            quiet_hours = QuietHours(start=start, end=end, enabled=True)
            return quiet_hours.is_in_quiet_hours()
        except (ValueError, TypeError):
            return False

    async def should_send_notification(
        self,
        user_id: UUID,
        category: NotificationCategory,
        channel: str,
    ) -> bool:
        """Check if notification should be sent based on preferences."""
        if self.preferences_repo is None:
            return True

        prefs = await self.preferences_repo.get_by_user_id(user_id)
        if not prefs:
            return True

        # Check quiet hours
        if await self.is_quiet_hours(user_id):
            # During quiet hours, only critical notifications
            if prefs.frequency == "immediate":
                return False

        # Check channel enabled
        channel_enabled = {
            "email": prefs.email_enabled,
            "sms": prefs.sms_enabled,
            "push": prefs.push_enabled,
            "in_app": prefs.in_app_enabled,
        }.get(channel, True)

        if not channel_enabled:
            return False

        # Check category preference
        cat_pref = await self.get_category_preference(user_id, category)
        if not cat_pref.enabled:
            return False

        # Check channel override for category
        if channel in cat_pref.channel_overrides:
            return cat_pref.channel_overrides[channel]

        return True

    async def get_digest_preferences(self, user_id: UUID) -> dict[str, Any]:
        """Get digest preferences for a user."""
        if self.preferences_repo is None:
            return {
                "frequency": "immediate",
                "enabled": True,
            }

        prefs = await self.preferences_repo.get_by_user_id(user_id)
        if not prefs:
            return {
                "frequency": "immediate",
                "enabled": True,
            }

        return {
            "frequency": prefs.frequency,
            "enabled": prefs.frequency != "immediate",
            "quiet_hours_start": prefs.quiet_hours_start,
            "quiet_hours_end": prefs.quiet_hours_end,
            "timezone": prefs.timezone,
        }


# Default tenant preferences
DEFAULT_TENANT_PREFERENCES: dict[str, Any] = {
    "email_enabled": True,
    "sms_enabled": True,
    "push_enabled": True,
    "in_app_enabled": True,
    "quiet_hours_start": None,
    "quiet_hours_end": None,
    "timezone": "UTC",
    "language": "en",
    "frequency": "immediate",
    "category_preferences": {
        "system": {"enabled": True, "channel_overrides": {}},
        "user": {"enabled": True, "channel_overrides": {}},
        "workflow": {"enabled": True, "channel_overrides": {}},
        "alert": {"enabled": True, "channel_overrides": {}},
        "marketing": {"enabled": False, "channel_overrides": {}},
    },
}