"""Exponential Backoff Retry Engine with Jitter and Failure Categorization."""

import math
import random
from typing import Any
from uuid import UUID

from app.core.logging import logger
from app.notification.domain.exceptions import (
    ProviderAuthError,
    ProviderError,
    ProviderTimeoutError,
    ProviderUnavailableError,
    QuotaExceededError,
    RateLimitError,
)
from app.notification.infrastructure.redis_queue import RedisNotificationQueue


class NotificationRetryEngine:
    """Configurable exponential backoff retry engine with jitter calculation and DLQ routing."""

    PERMANENT_ERROR_KEYWORDS = [
        "invalid recipient",
        "authentication failed",
        "account suspended",
        "invalid phone number",
        "unroutable destination",
        "hard bounce",
    ]

    def __init__(
        self,
        base_delay_sec: float = 1.0,
        max_delay_sec: float = 300.0,
        jitter_factor: float = 0.2,
        queue: RedisNotificationQueue | None = None,
    ):
        self.base_delay_sec = base_delay_sec
        self.max_delay_sec = max_delay_sec
        self.jitter_factor = jitter_factor
        self.queue = queue or RedisNotificationQueue()

    def is_transient(self, error: Exception | str) -> bool:
        """Categorize error as transient vs permanent."""
        err_str = str(error).lower()

        # Known permanent exception types
        if isinstance(error, (ProviderAuthError, QuotaExceededError)):
            return False

        # Known transient exception types
        if isinstance(error, (ProviderTimeoutError, ProviderUnavailableError, RateLimitError)):
            return True

        # Keyword matching
        for kw in self.PERMANENT_ERROR_KEYWORDS:
            if kw in err_str:
                return False

        return True

    def calculate_backoff(self, attempt: int) -> float:
        """Calculate exponential backoff delay with random jitter."""
        if attempt <= 0:
            return 0.0

        raw_delay = self.base_delay_sec * math.pow(2, attempt - 1)
        capped_delay = min(self.max_delay_sec, raw_delay)
        jitter = random.uniform(0, capped_delay * self.jitter_factor)
        return capped_delay + jitter

    async def handle_failure(
        self,
        notification_id: UUID,
        payload: dict[str, Any],
        error: Exception,
        current_attempt: int,
        max_retries: int = 3,
    ) -> dict[str, Any]:
        """Process job failure, determining whether to retry with backoff or move to DLQ."""
        is_transient_err = self.is_transient(error)
        err_msg = str(error)

        logger.warning(
            f"[RetryEngine] Notification {notification_id} failed on attempt {current_attempt}/{max_retries}: {err_msg} (Transient: {is_transient_err})"
        )

        # Permanent error or max retries exceeded -> Move to DLQ
        if not is_transient_err or current_attempt >= max_retries:
            reason = f"Permanent Failure: {err_msg}" if not is_transient_err else f"Max retries ({max_retries}) exhausted: {err_msg}"
            await self.queue.move_to_dlq(notification_id, payload, reason)
            return {
                "action": "moved_to_dlq",
                "reason": reason,
                "attempt": current_attempt,
            }

        # Transient error within retry limit -> Re-schedule with backoff
        backoff_sec = self.calculate_backoff(current_attempt)
        next_attempt = current_attempt + 1
        payload["attempts"] = next_attempt

        from datetime import datetime, timedelta
        run_at = datetime.utcnow() + timedelta(seconds=backoff_sec)

        await self.queue.schedule(notification_id, run_at, payload)
        logger.info(f"[RetryEngine] Rescheduled notification {notification_id} for attempt {next_attempt} in {backoff_sec:.2f}s")

        return {
            "action": "rescheduled",
            "backoff_sec": backoff_sec,
            "next_attempt": next_attempt,
        }
