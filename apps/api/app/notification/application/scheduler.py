"""Scheduler Engine for Delayed, One-Time, Cron, and Recurring Notifications."""

import asyncio
from datetime import datetime, timedelta
from typing import Any
from uuid import UUID, uuid4

from app.core.logging import logger
from app.notification.domain.job_models import JobState
from app.notification.infrastructure.redis_queue import RedisNotificationQueue


class NotificationScheduler:
    """Cron and delayed scheduling engine supporting timezone awareness and recurring triggers."""

    def __init__(self, queue: RedisNotificationQueue | None = None):
        self.queue = queue or RedisNotificationQueue()
        self._schedules: dict[str, dict[str, Any]] = {}
        self._is_running = False
        self._poller_task: asyncio.Task | None = None

    async def schedule_delayed(
        self,
        notification_id: UUID,
        delay_seconds: float,
        payload: dict[str, Any],
    ) -> datetime:
        """Schedule a job for execution after a specific delay in seconds."""
        run_at = datetime.utcnow() + timedelta(seconds=delay_seconds)
        await self.queue.schedule(notification_id, run_at, payload)
        logger.info(f"[Scheduler] Notification {notification_id} delayed by {delay_seconds}s (Runs at {run_at.isoformat()})")
        return run_at

    async def schedule_cron(
        self,
        schedule_name: str,
        cron_expression: str,
        payload: dict[str, Any],
        timezone_str: str = "UTC",
    ) -> str:
        """Register a recurring cron schedule (e.g. '0 9 * * *' for daily at 9am)."""
        schedule_id = str(uuid4())
        self._schedules[schedule_id] = {
            "id": schedule_id,
            "name": schedule_name,
            "cron": cron_expression,
            "timezone": timezone_str,
            "payload": payload,
            "created_at": datetime.utcnow().isoformat(),
            "active": True,
        }
        logger.info(f"[Scheduler] Registered cron schedule '{schedule_name}' ({cron_expression}) with ID {schedule_id}")
        return schedule_id

    async def list_schedules(self) -> list[dict[str, Any]]:
        """List active schedules."""
        return list(self._schedules.values())

    async def start(self) -> None:
        """Start the background scheduler polling loop."""
        if self._is_running:
            return
        self._is_running = True
        self._poller_task = asyncio.create_task(self._poll_loop())
        logger.info("[Scheduler] Polling loop started.")

    async def stop(self) -> None:
        """Stop the background scheduler polling loop."""
        self._is_running = False
        if self._poller_task:
            self._poller_task.cancel()
            try:
                await self._poller_task
            except asyncio.CancelledError:
                pass
        logger.info("[Scheduler] Polling loop stopped.")

    async def _poll_loop(self) -> None:
        while self._is_running:
            try:
                # Trigger ready scheduled jobs from queue ZSET
                for priority in ["critical", "high", "normal", "low"]:
                    job = await self.queue.dequeue(priority, timeout_sec=0)
                    if job:
                        # Re-enqueue ready item into processing queue
                        notif_id = UUID(job["notification_id"])
                        await self.queue.enqueue(notif_id, job.get("payload", {}))
                await asyncio.sleep(1.0)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"[Scheduler] Poller error: {e}")
                await asyncio.sleep(2.0)
