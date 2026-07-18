"""Identity authentication tests."""

from starlette.testclient import TestClient


def test_register():
    """Test user registration."""
    from app.main import app

    client = TestClient(app)
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password123"},
    )

    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_login():
    """Test user login."""
    from app.main import app

    client = TestClient(app)
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={"email": "login@example.com", "password": "password123"},
    )

    # Then login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "password123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
