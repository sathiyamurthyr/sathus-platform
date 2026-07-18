"""Search API schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


# Request schemas
class SearchRequest(BaseModel):
    """Search request schema."""

    query: str = Field(..., min_length=1, max_length=255)
    entity_types: list[str] | None = None
    limit: int = Field(20, ge=1, le=100)
    offset: int = Field(0, ge=0)


class IndexEntityRequest(BaseModel):
    """Index entity request schema."""

    entity_id: UUID
    entity_type: str
    title: str = Field(..., min_length=1, max_length=255)
    content: str
    metadata: dict | None = None
    tenant_id: UUID | None = None


class SaveSearchRequest(BaseModel):
    """Save search request schema."""

    name: str = Field(..., min_length=1, max_length=255)
    query: str = Field(..., min_length=1, max_length=255)
    entity_types: list[str] | None = None
    filters: dict | None = None


# Response schemas
class SearchResultResponse(BaseModel):
    """Search result response schema."""

    id: UUID
    entity_id: UUID
    entity_type: str
    title: str
    content: str
    score: float
    metadata: dict | None = None
    url: str | None = None


class SearchResponse(BaseModel):
    """Search response schema."""

    results: list[SearchResultResponse]
    total: int
    limit: int
    offset: int


class SearchHistoryResponse(BaseModel):
    """Search history response schema."""

    id: UUID
    user_id: UUID
    query: str
    entity_types: list[str] | None = None
    results_count: int
    created_at: datetime


class SavedSearchResponse(BaseModel):
    """Saved search response schema."""

    id: UUID
    user_id: UUID
    name: str
    query: str
    entity_types: list[str] | None = None
    filters: dict | None = None
    created_at: datetime
    updated_at: datetime | None = None


class PopularSearchResponse(BaseModel):
    """Popular search response schema."""

    query: str
    count: int