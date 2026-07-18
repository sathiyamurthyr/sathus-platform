"""Identity API endpoints."""

from datetime import datetime, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer

from app.core.database import get_db
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.identity.api.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
    UserProfileResponse,
)
from app.identity.application.services import AuthenticationService
from app.identity.infrastructure.repositories import RefreshTokenRepository, UserRepository

router = APIRouter()
security = HTTPBearer()


async def get_current_user(token: str = Depends(security)) -> dict:
    """Get current user from token."""
    payload = decode_token(token.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(
    request: RegisterRequest,
    db=Depends(get_db),
) -> TokenResponse:
    """Register a new user."""
    user_repo = UserRepository(db)
    token_repo = RefreshTokenRepository(db)
    service = AuthenticationService(user_repo, token_repo)

    user = await service.register(request.email, request.password)

    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db=Depends(get_db),
) -> TokenResponse:
    """Login a user."""
    user_repo = UserRepository(db)
    token_repo = RefreshTokenRepository(db)
    service = AuthenticationService(user_repo, token_repo)

    result = await service.login(request.email, request.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token, refresh_token, user = result
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    refresh_token: str,
    db=Depends(get_db),
) -> TokenResponse:
    """Refresh tokens."""
    user_repo = UserRepository(db)
    token_repo = RefreshTokenRepository(db)
    service = AuthenticationService(user_repo, token_repo)

    result = await service.refresh(refresh_token)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token, new_refresh = result
    return TokenResponse(access_token=access_token, refresh_token=new_refresh)


@router.post("/logout", status_code=204)
async def logout(
    user=Depends(get_current_user),
    db=Depends(get_db),
) -> None:
    """Logout user."""
    user_repo = UserRepository(db)
    token_repo = RefreshTokenRepository(db)
    service = AuthenticationService(user_repo, token_repo)

    await service.logout(UUID(user["sub"]))


@router.get("/me", response_model=UserResponse)
async def get_me(
    user=Depends(get_current_user),
    db=Depends(get_db),
) -> UserResponse:
    """Get current user."""
    user_repo = UserRepository(db)
    user_obj = await user_repo.get_by_id(UUID(user["sub"]))

    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        email=user_obj.email,
        email_verified=user_obj.email_verified,
        profile=UserProfileResponse(
            first_name=user_obj.profile.first_name if user_obj.profile else None,
            last_name=user_obj.profile.last_name if user_obj.profile else None,
            avatar=user_obj.profile.avatar if user_obj.profile else None,
            timezone=user_obj.profile.timezone if user_obj.profile else "UTC",
            language=user_obj.profile.language if user_obj.profile else "en",
            phone=user_obj.profile.phone if user_obj.profile else None,
            company=user_obj.profile.company if user_obj.profile else None,
        ),
    )
