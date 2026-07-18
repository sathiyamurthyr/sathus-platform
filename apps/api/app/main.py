"""Application factory for Sathus Platform."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.database import close_db, init_db
from app.core.exceptions import (
    http_exception_handler,
    unknown_exception_handler,
    validation_exception_handler,
)
from app.core.logging import setup_logging
from app.core.middleware import (
    CorrelationIDMiddleware,
    RequestLoggingMiddleware,
    RequestTimingMiddleware,
)
from app.core.redis import close_redis, init_redis

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle manager."""
    # Startup
    setup_logging()
    await init_db()
    await init_redis()
    yield
    # Shutdown
    await close_redis()
    await close_db()


def create_app() -> FastAPI:
    """Create FastAPI application instance."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        debug=settings.DEBUG,
        lifespan=lifespan,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom middleware
    app.add_middleware(CorrelationIDMiddleware)
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(RequestTimingMiddleware)

    # Exception handlers
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(404, http_exception_handler)
    app.add_exception_handler(500, unknown_exception_handler)

    # API Routes
    app.include_router(api_router, prefix="/api/v1")

    return app


app = create_app()
