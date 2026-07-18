"""Application middleware."""

import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging import get_logger

logger = get_logger(__name__)


class CorrelationIDMiddleware(BaseHTTPMiddleware):
    """Add correlation ID to requests."""

    async def dispatch(self, request: Request, call_next) -> Response:
        """Add correlation ID header."""
        correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        request.state.correlation_id = correlation_id

        response = await call_next(request)
        response.headers["X-Correlation-ID"] = correlation_id
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests."""

    async def dispatch(self, request: Request, call_next) -> Response:
        """Log request and response."""
        start_time = time.time()

        response = await call_next(request)

        duration = time.time() - start_time
        logger.info(
            "request_completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=round(duration * 1000, 2),
        )
        return response


class RequestTimingMiddleware(BaseHTTPMiddleware):
    """Add request timing header."""

    async def dispatch(self, request: Request, call_next) -> Response:
        """Add X-Response-Time header."""
        start_time = time.time()

        response = await call_next(request)

        duration = time.time() - start_time
        response.headers["X-Response-Time"] = f"{duration * 1000:.2f}ms"
        return response