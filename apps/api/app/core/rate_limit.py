"""Rate limiting utilities using Redis with in-memory fallback."""

import time
from collections import defaultdict
from fastapi import HTTPException, Request, status
from app.core.redis import get_redis


# In-memory fallback if Redis is unavailable or in mock mode
_local_rate_limit_cache: dict[str, list[float]] = defaultdict(list)


class RateLimiter:
    """Rate limiter dependency using Redis sliding window with in-memory fallback."""

    def __init__(self, times: int = 10, seconds: int = 60, key_prefix: str = "rl"):
        self.times = times
        self.seconds = seconds
        self.key_prefix = key_prefix

    async def __call__(self, request: Request) -> None:
        """Check if request exceeds rate limit."""
        client_ip = request.client.host if request.client else "127.0.0.1"
        endpoint = request.url.path
        key = f"{self.key_prefix}:{endpoint}:{client_ip}"
        now = time.time()

        try:
            redis = await get_redis()
            if hasattr(redis, "pipeline"):
                pipe = redis.pipeline()
                pipe.zremrangebyscore(key, 0, now - self.seconds)
                pipe.zadd(key, {str(now): now})
                pipe.zcard(key)
                pipe.expire(key, self.seconds + 5)
                results = await pipe.execute()
                request_count = results[2]
                if request_count > self.times:
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="Rate limit exceeded. Please try again later.",
                    )
                return
        except HTTPException:
            raise
        except Exception:
            pass

        # In-memory sliding window fallback
        window_start = now - self.seconds
        timestamps = [ts for ts in _local_rate_limit_cache[key] if ts > window_start]
        timestamps.append(now)
        _local_rate_limit_cache[key] = timestamps

        if len(timestamps) > self.times:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later.",
            )
