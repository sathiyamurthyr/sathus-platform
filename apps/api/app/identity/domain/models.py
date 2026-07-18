"""Identity domain models."""

from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserStatus(StrEnum):
    """User status enumeration."""

    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    LOCKED = "locked"
    DELETED = "deleted"


class UserProfile(BaseModel):
    """User profile value object."""

    first_name: str | None = None
    last_name: str | None = None
    avatar: str | None = None
    timezone: str = "UTC"
    language: str = "en"
    phone: str | None = None
    company: str | None = None


class User(BaseModel):
    """User aggregate root."""

    id: UUID
    email: EmailStr
    password_hash: str
    status: UserStatus = UserStatus.PENDING
    email_verified: bool = False
    created_at: str
    updated_at: str | None = None
    last_login_at: str | None = None
    profile: UserProfile = Field(default_factory=UserProfile)

    class Config:
        """Pydantic config."""

        frozen = True