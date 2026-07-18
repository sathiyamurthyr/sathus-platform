"""API v1 router."""

from fastapi import APIRouter

from app.api.v1.endpoints import health
from app.identity.api import endpoints as auth
from app.authorization.api import endpoints as authorization
from app.content.api import endpoints as content
from app.notification.api import endpoints as notification
from app.workflow.api import endpoints as workflow
from app.media.api import endpoints as media
from app.search.api import endpoints as search

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(authorization.router, prefix="/authorization", tags=["authorization"])
api_router.include_router(content.router, prefix="/content", tags=["content"])
api_router.include_router(notification.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(workflow.router, prefix="/workflows", tags=["workflows"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
