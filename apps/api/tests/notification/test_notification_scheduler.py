"""Unit tests for Phase 3 Scheduler Engine."""

from datetime import datetime
from uuid import uuid4

import pytest

from app.notification.application.scheduler import NotificationScheduler


@pytest.mark.asyncio
async def test_scheduler_delayed_job():
    """Test delayed notification scheduling."""
    scheduler = NotificationScheduler()
    notif_id = uuid4()
    payload = {"channel": "email", "body": "Delayed message"}

    run_at = await scheduler.schedule_delayed(notif_id, 10.0, payload)
    assert run_at > datetime.utcnow()


@pytest.mark.asyncio
async def test_scheduler_cron_registration():
    """Test recurring cron schedule registration."""
    scheduler = NotificationScheduler()
    schedule_id = await scheduler.schedule_cron(
        schedule_name="daily_digest",
        cron_expression="0 9 * * *",
        payload={"channel": "email", "body": "Daily Summary"},
    )
    assert schedule_id is not None

    schedules = await scheduler.list_schedules()
    assert len(schedules) == 1
    assert schedules[0]["name"] == "daily_digest"


@pytest.mark.asyncio
async def test_scheduler_start_stop():
    """Test scheduler background poller lifecycle."""
    scheduler = NotificationScheduler()
    await scheduler.start()
    assert scheduler._is_running is True

    await scheduler.stop()
    assert scheduler._is_running is False
