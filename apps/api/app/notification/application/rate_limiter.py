"""Sliding Window Rate Limiter for global, tenant, user, provider, and category protection."""

import time
from typing import Any

from app.core.logging import logger
from app.core.redis import get_redis


class NotificationRateLimiter:
    """Sliding-window rate limiter utilizing Redis ZSET for precise burst control and throttle enforcement."""

    PREFIX = "sathus:ratelimit:"

    def __init__(self):
        self._in_memory_counters: dict[str, list[float]] = {}

    _redis_available_cache: bool | None = None

    async def _get_client(self):
        if NotificationRateLimiter._redis_available_cache is False:
            return None
        try:
            client = await get_redis()
            await asyncio.wait_for(client.ping(), timeout=0.1)
            NotificationRateLimiter._redis_available_cache = True
            return client
        except Exception:
            NotificationRateLimiter._redis_available_cache = False
            return None

    async def is_allowed(
        self,
        key: str,
        limit: int = 100,
        window_seconds: int = 60,
    ) -> bool:
        """Check if request is allowed under rate limit rule."""
        if limit <= 0:
            return True

        now = time.time()
        clear_before = now - window_seconds
        client = await self._get_client()

        redis_key = f"{self.PREFIX}{key}"

        if client:
            try:
                pipe = client.pipeline()
                pipe.zremrangebyscore(redis_key, 0, clear_before)
                pipe.zcard(redis_key)
                pipe.zadd(redis_key, {str(now): now})
                pipe.expire(redis_key, window_seconds)
                results = await pipe.execute()

                current_count = results[1]
                if current_count >= limit:
                    logger.warning(f"[RateLimiter] Limit exceeded for key '{key}' ({current_count}/{limit} in {window_seconds}s)")
                    return False
                return True
            except Exception as e:
                logger.error(f"[RateLimiter] Redis error: {e}")

        # In-memory sliding window fallback
        timestamps = self._in_memory_counters.get(key, [])
        valid_timestamps = [t for t in timestamps if t > clear_before]

        if len(valid_timestamps) >= limit:
            logger.warning(f"[RateLimiter] In-Memory limit exceeded for key '{key}' ({len(valid_timestamps)}/{limit})")
            return False

        valid_timestamps.append(now)
        self._in_memory_counters[key] = valid_timestamps
        return True

    async def check_multi_limits(
        self,
        tenant_id: str | None = None,
        user_id: str | None = None,
        provider_name: str | None = None,
        category: str | None = None,
    ) -> tuple[bool, str | None]:
        """Check multi-tier rate limits (global, tenant, user, provider, category)."""
        rules = [
            ("global", 1000, 60),  # 1000 req/min global
        ]

        if tenant_id:
            rules.append((f"tenant:{tenant_id}", 300, 60))
        if user_id:
            rules.append((f"user:{user_id}", 30, 60))
        if provider_name:
            rules.append((f"provider:{provider_name}", 500, 60))
        if category:
            rules.append((f"category:{category}", 200, 60))

        for key, limit, window in rules:
            allowed = await self.is_allowed(key, limit, window)
            if not allowed:
                return False, key

        return True, None
