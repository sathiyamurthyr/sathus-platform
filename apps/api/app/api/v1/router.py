"""API v1 router."""

from fastapi import APIRouter

from app.api.v1.endpoints import health
from app.identity.api import endpoints as auth
from app.authorization.api import endpoints as authorization

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(authorization.router, prefix="/authorization", tags=["authorization"])
