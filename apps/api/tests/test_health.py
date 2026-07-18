"""Health check tests."""

import pytest
from httpx import AsyncClient
from starlette.testclient import TestClient


@pytest.mark.asyncio
async def test_health_check():
    """Test health endpoint returns OK."""
    from app.main import app

    client = TestClient(app)
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
