"""Unit tests for Phase 3 Redis Queue, Priority Queues, and DLQ."""

from datetime import datetime, timedelta
from uuid import uuid4

import pytest

from app.notification.domain.job_models import JobPriority, JobState
from app.notification.infrastructure.redis_queue import RedisNotificationQueue


@pytest.mark.asyncio
async def test_redis_queue_enqueue_dequeue():
    """Test enqueuing and dequeuing notification jobs."""
    queue = RedisNotificationQueue()
    notif_id = uuid4()
    payload = {"channel": "email", "body": "Queue test message", "priority": "normal"}

    success = await queue.enqueue(notif_id, payload)
    assert success is True

    job = await queue.dequeue(priority="normal", timeout_sec=1)
    assert job is not None
    assert job["notification_id"] == str(notif_id)
    assert job["status"] == JobState.PROCESSING.value


@pytest.mark.asyncio
async def test_redis_queue_delayed_schedule():
    """Test scheduling delayed jobs."""
    queue = RedisNotificationQueue()
    notif_id = uuid4()
    payload = {"channel": "sms", "body": "Delayed OTP", "priority": "high"}
    run_at = datetime.utcnow() + timedelta(seconds=1)

    scheduled = await queue.schedule(notif_id, run_at, payload)
    assert scheduled is True

    status_info = await queue.get_status(notif_id)
    assert status_info["status"] in [JobState.SCHEDULED.value, "unknown"]


@pytest.mark.asyncio
async def test_redis_queue_move_to_dlq():
    """Test moving exhausted jobs to Dead Letter Queue (DLQ)."""
    queue = RedisNotificationQueue()
    notif_id = uuid4()
    payload = {"channel": "webhook", "body": "Payload"}

    success = await queue.move_to_dlq(notif_id, payload, "Max retries exhausted")
    assert success is True

    status_info = await queue.get_status(notif_id)
    assert status_info["status"] == JobState.MOVED_TO_DLQ.value


@pytest.mark.asyncio
async def test_redis_queue_pause_resume():
    """Test queue pause and resume controls."""
    queue = RedisNotificationQueue()
    await queue.pause_queue("high")
    assert await queue.is_paused("high") is True

    await queue.resume_queue("high")
    assert await queue.is_paused("high") is False


@pytest.mark.asyncio
async def test_redis_queue_stats():
    """Test queue stats reporting."""
    queue = RedisNotificationQueue()
    stats = await queue.get_stats()

    assert "normal" in stats
    assert "critical" in stats
    assert "dlq" in stats
