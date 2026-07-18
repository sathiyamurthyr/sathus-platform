"""Health check tests."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check():
    """Test health endpoint returns OK."""
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}