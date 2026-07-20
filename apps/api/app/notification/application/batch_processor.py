"""Batch processing engine for bulk email, SMS, and push notification dispatch."""

import asyncio
from typing import Any
from uuid import UUID, uuid4

from app.core.logging import logger
from app.notification.domain.job_models import BatchDispatchJob, JobPriority
from app.notification.infrastructure.redis_queue import RedisNotificationQueue


class BatchNotificationProcessor:
    """High-throughput batch processor for chunking, parallelizing, and tracking bulk notifications."""

    def __init__(self, queue: RedisNotificationQueue | None = None, chunk_size: int = 100):
        self.queue = queue or RedisNotificationQueue()
        self.chunk_size = chunk_size
        self._batches: dict[str, dict[str, Any]] = {}

    def chunk_items(self, items: list[Any], chunk_size: int) -> list[list[Any]]:
        """Split items into equal chunks for parallel execution."""
        return [items[i : i + chunk_size] for i in range(0, len(items), chunk_size)]

    async def process_batch(
        self,
        recipients: list[dict[str, Any]],
        channel: str,
        subject: str | None,
        body: str,
        tenant_id: UUID | None = None,
        priority: JobPriority | str = JobPriority.NORMAL,
    ) -> BatchDispatchJob:
        """Enqueue a bulk batch of notifications in parallel chunks."""
        batch_id = uuid4()
        total_count = len(recipients)

        logger.info(f"[BatchProcessor] Starting batch {batch_id} for {total_count} recipients on channel '{channel}'")

        batch_summary = {
            "batch_id": str(batch_id),
            "tenant_id": str(tenant_id) if tenant_id else None,
            "channel": channel,
            "total_recipients": total_count,
            "processed_count": 0,
            "failed_count": 0,
            "status": "processing",
        }
        self._batches[str(batch_id)] = batch_summary

        chunks = self.chunk_items(recipients, self.chunk_size)

        async def _dispatch_chunk(chunk: list[dict[str, Any]]):
            for recipient in chunk:
                notif_id = uuid4()
                destination = recipient.get("destination") or recipient.get("email") or recipient.get("phone") or recipient.get("token")
                payload = {
                    "batch_id": str(batch_id),
                    "channel": channel,
                    "destination": destination,
                    "subject": subject,
                    "body": body,
                    "priority": priority.value if hasattr(priority, "value") else str(priority),
                    "metadata": recipient.get("metadata", {}),
                }

                success = await self.queue.enqueue(notif_id, payload)
                if success:
                    batch_summary["processed_count"] += 1
                else:
                    batch_summary["failed_count"] += 1

        await asyncio.gather(*[_dispatch_chunk(c) for c in chunks])

        batch_summary["status"] = "completed"
        logger.info(f"[BatchProcessor] Batch {batch_id} enqueued: {batch_summary['processed_count']}/{total_count} items ready.")

        return BatchDispatchJob(
            batch_id=batch_id,
            tenant_id=tenant_id,
            channel=channel,
            total_recipients=total_count,
            processed_count=batch_summary["processed_count"],
            failed_count=batch_summary["failed_count"],
            status="completed",
        )

    async def get_batch_status(self, batch_id: UUID) -> dict[str, Any] | None:
        """Retrieve execution progress for a batch job."""
        return self._batches.get(str(batch_id))
