"""Redis layer for caching and pub/sub."""

from redis.asyncio import Redis

from app.core.config import get_settings

settings = get_settings()

# Redis client
redis_client: Redis | None = None


async def get_redis() -> Redis:
    """Get Redis client instance."""
    global redis_client
    if redis_client is None:
        redis_client = Redis.from_url(settings.REDIS_URL)
    return redis_client


async def init_redis() -> None:
    """Initialize Redis connection."""
    global redis_client
    try:
        redis_client = Redis.from_url(settings.REDIS_URL)
        await redis_client.ping()
    except Exception as e:
        print(f"[WARNING] Redis connection failed: {e}. Falling back to MockRedis.")
        class MockRedis:
            async def ping(self):
                return True
            async def get(self, *args, **kwargs):
                return None
            async def set(self, *args, **kwargs):
                return True
            async def delete(self, *args, **kwargs):
                return 0
            async def close(self):
                pass
        redis_client = MockRedis()


async def close_redis() -> None:
    """Close Redis connection."""
    global redis_client
    if redis_client:
        try:
            await redis_client.close()
        except Exception:
            pass
        redis_client = None