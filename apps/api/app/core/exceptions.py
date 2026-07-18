"""Global exception handling."""

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.core.logging import get_logger

logger = get_logger(__name__)


class ProblemDetails(BaseModel):
    """RFC 7807 Problem Details response."""

    type: str
    title: str
    status: int
    detail: str
    instance: str | None = None


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle validation errors."""
    logger.warning("validation_error", errors=exc.errors())
    return JSONResponse(
        status_code=422,
        content=ProblemDetails(
            type="https://tools.ietf.org/html/rfc7231#section-6.5.1",
            title="Validation Error",
            status=422,
            detail="Request validation failed",
            instance=str(request.url),
        ).model_dump(),
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle HTTP exceptions."""
    logger.warning("http_error", status_code=exc.status_code, detail=exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content=ProblemDetails(
            type="https://tools.ietf.org/html/rfc7231#section-6.6",
            title=exc.detail or "HTTP Error",
            status=exc.status_code,
            detail=exc.detail or "An HTTP error occurred",
            instance=str(request.url),
        ).model_dump(),
    )


async def unknown_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unknown exceptions."""
    logger.error("unknown_error", error=str(exc), path=str(request.url))
    return JSONResponse(
        status_code=500,
        content=ProblemDetails(
            type="https://tools.ietf.org/html/rfc7231#section-6.6.1",
            title="Internal Server Error",
            status=500,
            detail="An unexpected error occurred",
            instance=str(request.url),
        ).model_dump(),
    )