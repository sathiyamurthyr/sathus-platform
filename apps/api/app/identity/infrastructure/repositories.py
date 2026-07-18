"""Identity repositories."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.identity.infrastructure.models import RefreshToken, User


class UserRepository:
    """User repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(self, email: str, password_hash: str) -> User:
        """Create a new user."""
        user = User(email=email, password_hash=password_hash)
        self.session.add(user)
        await self.session.flush()
        return user

    async def get_by_email(self, email: str) -> User | None:
        """Get user by email."""
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: UUID) -> User | None:
        """Get user by ID."""
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def update_last_login(self, user: User) -> None:
        """Update last login timestamp."""
        user.last_login_at = datetime.utcnow()
        await self.session.flush()


class RefreshTokenRepository:
    """Refresh token repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(self, user_id: UUID, token_hash: str, expires_at: datetime) -> RefreshToken:
        """Create a refresh token."""
        token = RefreshToken(user_id=user_id, token_hash=token_hash, expires_at=expires_at)
        self.session.add(token)
        await self.session.flush()
        return token

    async def get_by_hash(self, token_hash: str) -> RefreshToken | None:
        """Get token by hash."""
        result = await self.session.execute(
            select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        )
        return result.scalar_one_or_none()

    async def revoke(self, token: RefreshToken) -> None:
        """Revoke a token."""
        token.revoked_at = datetime.utcnow()
        await self.session.flush()

    async def revoke_all_for_user(self, user_id: UUID) -> None:
        """Revoke all tokens for a user."""
        await self.session.execute(
            select(RefreshToken)
            .where(RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None))
            .update({RefreshToken.revoked_at: datetime.utcnow()})
        )
        await self.session.flush()
