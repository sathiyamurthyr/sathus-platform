"""Worker Manager for orchestrating worker pools, scaling, health reporting, and graceful shutdown."""

import asyncio
from typing import Any

from app.core.logging import logger
from app.notification.workers.workers import (
    BaseWorker,
    EmailWorker,
    InAppWorker,
    PushWorker,
    SmsWorker,
    WebhookWorker,
)


class WorkerManager:
    """Orchestrator for worker instance lifecycles, health reporting, and cluster management."""

    def __init__(self):
        self.workers: dict[str, BaseWorker] = {}
        self._is_running = False

    def bootstrap_default_workers(self) -> None:
        """Instantiate default worker pool for all notification channels."""
        default_workers = [
            EmailWorker(),
            SmsWorker(),
            PushWorker(),
            WebhookWorker(),
            InAppWorker(),
        ]
        for w in default_workers:
            self.register_worker(w)

    def register_worker(self, worker: BaseWorker) -> None:
        """Register a worker instance."""
        self.workers[worker.worker_id] = worker
        logger.info(f"[WorkerManager] Registered worker '{worker.worker_id}' ({worker.channel_name})")

    async def start_all(self) -> None:
        """Start all registered background workers."""
        if not self.workers:
            self.bootstrap_default_workers()

        self._is_running = True
        for w in self.workers.values():
            await w.start()
        logger.info(f"[WorkerManager] Started pool of {len(self.workers)} workers.")

    async def stop_all(self) -> None:
        """Stop all background workers gracefully."""
        self._is_running = False
        for w in self.workers.values():
            await w.stop()
        logger.info("[WorkerManager] All workers stopped cleanly.")

    async def pause_all(self) -> None:
        """Pause processing across all workers."""
        for w in self.workers.values():
            await w.pause()
        logger.info("[WorkerManager] All workers paused.")

    async def resume_all(self) -> None:
        """Resume processing across all workers."""
        for w in self.workers.values():
            await w.resume()
        logger.info("[WorkerManager] All workers resumed.")

    def get_all_worker_statuses(self) -> list[dict[str, Any]]:
        """Collect status reports from all active workers."""
        return [w.get_status_report() for w in self.workers.values()]
