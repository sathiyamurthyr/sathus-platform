"""Identity API schemas."""

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Registration request schema."""

    email: EmailStr
    password: str = Field(..., min_length=8)


class LoginRequest(BaseModel):
    """Login request schema."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response schema."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class ProfileUpdateRequest(BaseModel):
    """Profile update request schema."""

    first_name: str | None = None
    last_name: str | None = None
    avatar: str | None = None
    timezone: str | None = None
    language: str | None = None
    phone: str | None = None
    company: str | None = None


class UserProfileResponse(BaseModel):
    """User profile response schema."""

    first_name: str | None = None
    last_name: str | None = None
    avatar: str | None = None
    timezone: str = "UTC"
    language: str = "en"
    phone: str | None = None
    company: str | None = None


class UserResponse(BaseModel):
    """User response schema."""

    email: EmailStr
    email_verified: bool
    profile: UserProfileResponse