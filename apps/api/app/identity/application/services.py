"""Identity application services."""

from datetime import datetime, timedelta
from uuid import UUID

from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.identity.infrastructure.models import User, UserStatus
from app.identity.infrastructure.repositories import RefreshTokenRepository, UserRepository


class AuthenticationService:
    """Authentication service."""

    def __init__(
        self,
        user_repo: UserRepository,
        token_repo: RefreshTokenRepository,
    ):
        """Initialize service."""
        self.user_repo = user_repo
        self.token_repo = token_repo

    async def register(self, email: str, password: str) -> User:
        """Register a new user."""
        password_hash = hash_password(password)
        user = await self.user_repo.create(email, password_hash)
        return user

    async def login(self, email: str, password: str) -> tuple[str, str, User] | None:
        """Login a user."""
        user = await self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            return None

        if user.status != UserStatus.ACTIVE:
            return None

        access_token = create_access_token({"sub": str(user.id), "email": user.email})
        refresh_token = create_refresh_token({"sub": str(user.id)})

        # Store refresh token
        token_hash = hash_password(refresh_token)
        expires_at = datetime.utcnow() + timedelta(days=7)
        await self.token_repo.create(user.id, token_hash, expires_at)

        await self.user_repo.update_last_login(user)
        return access_token, refresh_token, user

    async def refresh(self, refresh_token: str) -> tuple[str, str] | None:
        """Refresh tokens."""
        token_hash = hash_password(refresh_token)
        stored_token = await self.token_repo.get_by_hash(token_hash)

        if not stored_token or stored_token.revoked_at:
            return None

        if stored_token.expires_at < datetime.utcnow():
            return None

        user = await self.user_repo.get_by_id(stored_token.user_id)
        if not user:
            return None

        # Revoke old token
        await self.token_repo.revoke(stored_token)

        # Create new tokens
        new_access = create_access_token({"sub": str(user.id), "email": user.email})
        new_refresh = create_refresh_token({"sub": str(user.id)})

        new_hash = hash_password(new_refresh)
        new_expires = datetime.utcnow() + timedelta(days=7)
        await self.token_repo.create(user.id, new_hash, new_expires)

        return new_access, new_refresh

    async def logout(self, user_id: UUID) -> None:
        """Logout user by revoking all tokens."""
        await self.token_repo.revoke_all_for_user(user_id)