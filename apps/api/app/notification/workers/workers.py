"""Dedicated Async Background Workers for Email, SMS, Push, Webhook, and In-App Channels."""

import asyncio
import socket
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any
from uuid import UUID

from app.core.logging import logger
from app.notification.application.rate_limiter import NotificationRateLimiter
from app.notification.application.retry_engine import NotificationRetryEngine
from app.notification.application.services import NotificationDispatchEngine, ProviderRegistry
from app.notification.infrastructure.redis_queue import RedisNotificationQueue


class BaseWorker(ABC):
    """Abstract async worker lifecycle manager."""

    def __init__(
        self,
        worker_id: str | None = None,
        queue: RedisNotificationQueue | None = None,
        dispatch_engine: NotificationDispatchEngine | None = None,
    ):
        self.hostname = socket.gethostname()
        self.worker_id = worker_id or f"{self.channel_name}-worker-{self.hostname}-{id(self)}"
        self.queue = queue or RedisNotificationQueue()
        self.dispatch_engine = dispatch_engine or NotificationDispatchEngine(ProviderRegistry())
        self.retry_engine = NotificationRetryEngine(queue=self.queue)
        self.rate_limiter = NotificationRateLimiter()

        self._is_running = False
        self._is_paused = False
        self._active_jobs = 0
        self._processed_jobs = 0
        self._failed_jobs = 0
        self._last_heartbeat = datetime.utcnow()
        self._worker_task: asyncio.Task | None = None

    @property
    @abstractmethod
    def channel_name(self) -> str:
        """Worker channel identifier."""
        pass

    async def start(self) -> None:
        """Start async worker polling loop."""
        if self._is_running:
            return
        self._is_running = True
        self._worker_task = asyncio.create_task(self._run_loop())
        logger.info(f"[{self.worker_id}] Worker started on channel '{self.channel_name}'")

    async def stop(self) -> None:
        """Gracefully shut down worker."""
        self._is_running = False
        if self._worker_task:
            self._worker_task.cancel()
            try:
                await self._worker_task
            except asyncio.CancelledError:
                pass
        logger.info(f"[{self.worker_id}] Worker stopped cleanly.")

    async def pause(self) -> None:
        """Pause job processing."""
        self._is_paused = True
        logger.info(f"[{self.worker_id}] Worker paused.")

    async def resume(self) -> None:
        """Resume job processing."""
        self._is_paused = False
        logger.info(f"[{self.worker_id}] Worker resumed.")

    def get_status_report(self) -> dict[str, Any]:
        """Return worker metrics and status summary."""
        return {
            "worker_id": self.worker_id,
            "worker_type": self.channel_name,
            "hostname": self.hostname,
            "status": "paused" if self._is_paused else ("active" if self._is_running else "stopped"),
            "active_jobs_count": self._active_jobs,
            "processed_jobs_count": self._processed_jobs,
            "failed_jobs_count": self._failed_jobs,
            "last_heartbeat": self._last_heartbeat.isoformat(),
        }

    async def _run_loop(self) -> None:
        while self._is_running:
            try:
                self._last_heartbeat = datetime.utcnow()
                if self._is_paused:
                    await asyncio.sleep(1.0)
                    continue

                job = await self.queue.dequeue(priority="normal", timeout_sec=1)
                if job:
                    await self._process_job(job)
                else:
                    await asyncio.sleep(0.1)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"[{self.worker_id}] Unhandled error in run loop: {e}")
                await asyncio.sleep(1.0)

    async def _process_job(self, job: dict[str, Any]) -> None:
        self._active_jobs += 1
        notif_id_str = job.get("notification_id")
        notif_id = UUID(notif_id_str) if notif_id_str else UUID("00000000-0000-0000-0000-000000000000")
        payload = job.get("payload", {})

        current_attempt = payload.get("attempts", 1)
        max_retries = payload.get("max_retries", 3)

        try:
            # Check rate limit
            allowed, rule = await self.rate_limiter.check_multi_limits(
                tenant_id=payload.get("tenant_id"),
                user_id=payload.get("user_id"),
                provider_name=payload.get("provider_name"),
                category=payload.get("category"),
            )

            if not allowed:
                logger.warning(f"[{self.worker_id}] Rate limit exceeded on rule '{rule}'; delaying job {notif_id}")
                await self.queue.schedule(notif_id, datetime.utcnow(), payload)
                return

            res = await self.dispatch_engine.send_direct(
                channel=payload.get("channel", self.channel_name),
                destination=payload.get("destination", ""),
                subject=payload.get("subject"),
                body=payload.get("body", ""),
                provider_name=payload.get("provider_name"),
                metadata=payload.get("metadata"),
            )

            if res.get("success"):
                self._processed_jobs += 1
                logger.info(f"[{self.worker_id}] Dispatched notification {notif_id} via {res.get('provider')}")
            else:
                raise Exception(res.get("error", "Dispatch failed"))

        except Exception as err:
            self._failed_jobs += 1
            await self.retry_engine.handle_failure(
                notification_id=notif_id,
                payload=payload,
                error=err,
                current_attempt=current_attempt,
                max_retries=max_retries,
            )
        finally:
            self._active_jobs = max(0, self._active_jobs - 1)


class EmailWorker(BaseWorker):
    """Dedicated Email Channel Worker."""

    @property
    def channel_name(self) -> str:
        return "email"


class SmsWorker(BaseWorker):
    """Dedicated SMS Channel Worker."""

    @property
    def channel_name(self) -> str:
        return "sms"


class PushWorker(BaseWorker):
    """Dedicated Push Notification Channel Worker."""

    @property
    def channel_name(self) -> str:
        return "push"


class WebhookWorker(BaseWorker):
    """Dedicated Outgoing Webhook Worker."""

    @property
    def channel_name(self) -> str:
        return "webhook"


class InAppWorker(BaseWorker):
    """Dedicated In-App Notification Worker."""

    @property
    def channel_name(self) -> str:
        return "in_app"
