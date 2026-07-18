"""Identity database models."""

from datetime import datetime
from enum import Enum
from uuid import UUID

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class UserStatus(str, Enum):
    """User status enumeration."""

    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    LOCKED = "locked"
    DELETED = "deleted"


class User(Base):
    """User database model."""

    __tablename__ = "users"

    id: UUID = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    email: str = Column(String(255), unique=True, nullable=False, index=True)
    password_hash: str = Column(String(255), nullable=False)
    status: UserStatus = Column(SQLEnum(UserStatus), default=UserStatus.PENDING)
    email_verified: bool = Column(Boolean, default=False)
    created_at: datetime = Column(DateTime(timezone=True), server_default=func.now())
    updated_at: datetime = Column(DateTime(timezone=True), onupdate=func.now())
    last_login_at: datetime = Column(DateTime(timezone=True), nullable=True)

    profile: "UserProfile" = relationship("UserProfile", back_populates="user", uselist=False)
    refresh_tokens: list["RefreshToken"] = relationship("RefreshToken", back_populates="user")


class UserProfile(Base):
    """User profile database model."""

    __tablename__ = "user_profiles"

    user_id: UUID = Column(
        PostgresUUID(as_uuid=True), ForeignKey("users.id"), primary_key=True
    )
    first_name: str = Column(String(100), nullable=True)
    last_name: str = Column(String(100), nullable=True)
    avatar: str = Column(String(500), nullable=True)
    timezone: str = Column(String(50), default="UTC")
    language: str = Column(String(10), default="en")
    phone: str = Column(String(50), nullable=True)
    company: str = Column(String(255), nullable=True)

    user: User = relationship("User", back_populates="profile")


class RefreshToken(Base):
    """Refresh token database model."""

    __tablename__ = "refresh_tokens"

    id: UUID = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    user_id: UUID = Column(
        PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    token_hash: str = Column(String(255), nullable=False, unique=True, index=True)
    expires_at: datetime = Column(DateTime(timezone=True), nullable=False)
    created_at: datetime = Column(DateTime(timezone=True), server_default=func.now())
    revoked_at: datetime = Column(DateTime(timezone=True), nullable=True)

    user: User = relationship("User", back_populates="refresh_tokens")