"""Redis-backed Priority, Scheduled, Retry, and Dead Letter Queue (DLQ) Implementation."""

import asyncio
import json
import time
from datetime import datetime
from typing import Any
from uuid import UUID

from app.core.logging import logger
from app.core.redis import get_redis
from app.notification.domain.job_models import JobPriority, JobState, NotificationJobPayload, QueueStats
from app.notification.domain.queue_interfaces import NotificationQueue


class RedisNotificationQueue(NotificationQueue):
    """Production Redis-backed priority queue engine with delayed scheduling, DLQ, and fallback in-memory support."""

    PREFIX = "sathus:queue:"
    SCHEDULED_SET = f"{PREFIX}scheduled"
    DLQ_NAME = f"{PREFIX}dlq"
    PAUSED_SET = f"{PREFIX}paused"

    def __init__(self):
        self._in_memory_queues: dict[str, list[dict[str, Any]]] = {
            "critical": [],
            "high": [],
            "normal": [],
            "low": [],
            "dlq": [],
        }
        self._in_memory_scheduled: list[dict[str, Any]] = []
        self._in_memory_statuses: dict[str, dict[str, Any]] = {}
        self._paused_queues: set[str] = set()

    _redis_available_cache: bool | None = None

    async def _get_client(self):
        if RedisNotificationQueue._redis_available_cache is False:
            return None
        try:
            client = await get_redis()
            await asyncio.wait_for(client.ping(), timeout=0.1)
            RedisNotificationQueue._redis_available_cache = True
            return client
        except Exception as e:
            RedisNotificationQueue._redis_available_cache = False
            logger.debug(f"[RedisQueue] Redis connection unavailable ({e}); utilizing in-memory queue engine.")
            return None

    def _queue_key(self, priority: str | JobPriority) -> str:
        p_name = priority.value if hasattr(priority, "value") else str(priority).lower()
        return f"{self.PREFIX}{p_name}"

    async def enqueue(self, notification_id: UUID, payload: dict[str, Any]) -> bool:
        client = await self._get_client()
        priority = payload.get("priority", "normal")
        q_key = self.queue_name_for_priority(priority)

        job_data = {
            "notification_id": str(notification_id),
            "payload": payload,
            "enqueued_at": datetime.utcnow().isoformat(),
            "status": JobState.QUEUED.value,
        }

        if client:
            try:
                await client.rpush(q_key, json.dumps(job_data))
                await client.hset(f"{self.PREFIX}job:{notification_id}", "status", JobState.QUEUED.value)
                return True
            except Exception as e:
                logger.error(f"[RedisQueue] Enqueue error: {e}")

        # In-Memory fallback
        p_str = priority.value if hasattr(priority, "value") else str(priority).lower()
        if p_str not in self._in_memory_queues:
            p_str = "normal"
        self._in_memory_queues[p_str].append(job_data)
        self._in_memory_statuses[str(notification_id)] = job_data
        return True

    def queue_name_for_priority(self, priority: Any) -> str:
        p_str = priority.value if hasattr(priority, "value") else str(priority).lower()
        return f"{self.PREFIX}{p_str}"

    async def schedule(self, notification_id: UUID, run_at: datetime, payload: dict[str, Any] | None = None) -> bool:
        client = await self._get_client()
        ts = run_at.timestamp()

        job_data = {
            "notification_id": str(notification_id),
            "payload": payload or {},
            "scheduled_at": run_at.isoformat(),
            "status": JobState.SCHEDULED.value,
        }

        if client:
            try:
                await client.zadd(self.SCHEDULED_SET, {json.dumps(job_data): ts})
                await client.hset(f"{self.PREFIX}job:{notification_id}", "status", JobState.SCHEDULED.value)
                return True
            except Exception as e:
                logger.error(f"[RedisQueue] Schedule error: {e}")

        job_data["run_timestamp"] = ts
        self._in_memory_scheduled.append(job_data)
        self._in_memory_statuses[str(notification_id)] = job_data
        return True

    async def dequeue(self, priority: str = "normal", timeout_sec: int = 1) -> dict[str, Any] | None:
        client = await self._get_client()
        q_key = self.queue_name_for_priority(priority)

        # Check pause status
        if await self.is_paused(priority):
            return None

        if client:
            try:
                # First pull ready scheduled jobs
                now_ts = time.time()
                ready = await client.zrangebyscore(self.SCHEDULED_SET, 0, now_ts, start=0, num=1)
                if ready:
                    job_str = ready[0]
                    await client.zrem(self.SCHEDULED_SET, job_str)
                    data = json.loads(job_str)
                    data["status"] = JobState.PROCESSING.value
                    return data

                # Dequeue from priority queue
                res = await client.blpop([q_key], timeout=timeout_sec)
                if res:
                    _, item = res
                    data = json.loads(item)
                    data["status"] = JobState.PROCESSING.value
                    return data
            except Exception as e:
                logger.error(f"[RedisQueue] Dequeue error: {e}")

        # In-memory dequeue fallback
        now_ts = time.time()
        ready_sched = [j for j in self._in_memory_scheduled if j.get("run_timestamp", 0) <= now_ts]
        if ready_sched:
            item = ready_sched[0]
            self._in_memory_scheduled.remove(item)
            item["status"] = JobState.PROCESSING.value
            return item

        p_str = priority.lower()
        q_list = self._in_memory_queues.get(p_str, [])
        if q_list:
            item = q_list.pop(0)
            item["status"] = JobState.PROCESSING.value
            return item

        return None

    async def move_to_dlq(self, notification_id: UUID, payload: dict[str, Any], reason: str) -> bool:
        client = await self._get_client()
        job_data = {
            "notification_id": str(notification_id),
            "payload": payload,
            "failed_at": datetime.utcnow().isoformat(),
            "reason": reason,
            "status": JobState.MOVED_TO_DLQ.value,
        }

        if client:
            try:
                await client.rpush(self.DLQ_NAME, json.dumps(job_data))
                await client.hset(f"{self.PREFIX}job:{notification_id}", "status", JobState.MOVED_TO_DLQ.value)
                return True
            except Exception as e:
                logger.error(f"[RedisQueue] Move to DLQ error: {e}")

        self._in_memory_queues["dlq"].append(job_data)
        self._in_memory_statuses[str(notification_id)] = job_data
        return True

    async def retry(self, notification_id: UUID) -> bool:
        client = await self._get_client()
        status_info = await self.get_status(notification_id)
        if not status_info:
            return False

        payload = status_info.get("payload", {})
        return await self.enqueue(notification_id, payload)

    async def cancel(self, notification_id: UUID) -> bool:
        client = await self._get_client()
        nid_str = str(notification_id)

        if client:
            try:
                await client.hset(f"{self.PREFIX}job:{nid_str}", "status", JobState.CANCELLED.value)
                return True
            except Exception as e:
                logger.error(f"[RedisQueue] Cancel error: {e}")

        if nid_str in self._in_memory_statuses:
            self._in_memory_statuses[nid_str]["status"] = JobState.CANCELLED.value
        return True

    async def get_status(self, notification_id: UUID) -> dict[str, Any]:
        client = await self._get_client()
        nid_str = str(notification_id)

        if client:
            try:
                st = await client.hget(f"{self.PREFIX}job:{nid_str}", "status")
                if st:
                    return {"notification_id": nid_str, "status": st.decode("utf-8") if isinstance(st, bytes) else st}
            except Exception as e:
                logger.error(f"[RedisQueue] Get status error: {e}")

        return self._in_memory_statuses.get(nid_str, {"notification_id": nid_str, "status": "unknown"})

    async def get_stats(self) -> dict[str, QueueStats]:
        client = await self._get_client()
        result = {}

        priorities = ["critical", "high", "normal", "low"]
        for p in priorities:
            q_key = self.queue_name_for_priority(p)
            depth = 0
            if client:
                try:
                    depth = await client.llen(q_key)
                except Exception:
                    pass
            else:
                depth = len(self._in_memory_queues.get(p, []))

            is_p = await self.is_paused(p)
            result[p] = QueueStats(
                queue_name=p,
                queued_count=depth,
                is_paused=is_p,
            )

        dlq_depth = 0
        if client:
            try:
                dlq_depth = await client.llen(self.DLQ_NAME)
            except Exception:
                pass
        else:
            dlq_depth = len(self._in_memory_queues.get("dlq", []))

        result["dlq"] = QueueStats(queue_name="dlq", dlq_count=dlq_depth)
        return result

    async def pause_queue(self, priority: str) -> bool:
        p_name = priority.lower()
        client = await self._get_client()
        if client:
            try:
                await client.sadd(self.PAUSED_SET, p_name)
            except Exception as e:
                logger.error(f"[RedisQueue] Pause error: {e}")
        self._paused_queues.add(p_name)
        return True

    async def resume_queue(self, priority: str) -> bool:
        p_name = priority.lower()
        client = await self._get_client()
        if client:
            try:
                await client.srem(self.PAUSED_SET, p_name)
            except Exception as e:
                logger.error(f"[RedisQueue] Resume error: {e}")
        self._paused_queues.discard(p_name)
        return True

    async def is_paused(self, priority: str) -> bool:
        p_name = priority.lower()
        client = await self._get_client()
        if client:
            try:
                return await client.sismember(self.PAUSED_SET, p_name)
            except Exception:
                pass
        return p_name in self._paused_queues
