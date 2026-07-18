"""Identity security tests."""

import pytest

from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password


def test_hash_password():
    """Test password hashing."""
    password = "testpassword123"
    hashed = hash_password(password)
    assert hashed != password
    assert len(hashed) > 50


def test_verify_password():
    """Test password verification."""
    password = "testpassword123"
    hashed = hash_password(password)
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False


def test_create_access_token():
    """Test access token creation."""
    data = {"sub": "user-123", "email": "test@example.com"}
    token = create_access_token(data)
    assert token is not None
    assert len(token) > 100


def test_create_refresh_token():
    """Test refresh token creation."""
    data = {"sub": "user-123"}
    token = create_refresh_token(data)
    assert token is not None
    assert len(token) > 100