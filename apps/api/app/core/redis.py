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
    redis_client = Redis.from_url(settings.REDIS_URL)
    await redis_client.ping()


async def close_redis() -> None:
    """Close Redis connection."""
    global redis_client
    if redis_client:
        await redis_client.close()
        redis_client = None