"""Identity database models."""

from enum import Enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    String,
    func,
)
from sqlalchemy import (
    Enum as SQLEnum,
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
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    status = Column(SQLEnum(UserStatus), default=UserStatus.PENDING)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    refresh_tokens = relationship("RefreshToken", back_populates="user")


class UserProfile(Base):
    """User profile database model."""

    __tablename__ = "user_profiles"
    __allow_unmapped__ = True

    user_id = Column(
        PostgresUUID(as_uuid=True), ForeignKey("users.id"), primary_key=True
    )
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    avatar = Column(String(500), nullable=True)
    timezone = Column(String(50), default="UTC")
    language = Column(String(10), default="en")
    phone = Column(String(50), nullable=True)
    company = Column(String(255), nullable=True)

    user = relationship("User", back_populates="profile")


class RefreshToken(Base):
    """Refresh token database model."""

    __tablename__ = "refresh_tokens"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    user_id = Column(
        PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    token_hash = Column(String(255), nullable=False, unique=True, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    revoked_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="refresh_tokens")
