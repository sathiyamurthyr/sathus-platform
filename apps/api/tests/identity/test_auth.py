"""Identity authentication tests."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register():
    """Test user registration."""
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/auth/register",
            json={"email": "test@example.com", "password": "password123"},
        )

    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_login():
    """Test user login."""
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as client:
        # Register first
        await client.post(
            "/api/v1/auth/register",
            json={"email": "login@example.com", "password": "password123"},
        )

        # Then login
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "login@example.com", "password": "password123"},
        )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data