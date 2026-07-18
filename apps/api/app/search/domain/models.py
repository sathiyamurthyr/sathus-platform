"""Search domain models."""

from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field


class SearchableType(StrEnum):
    """Searchable entity type enumeration."""

    USER = "user"
    ROLE = "role"
    PERMISSION = "permission"
    CONTENT = "content"
    MEDIA = "media"
    DOCUMENT = "document"
    IMAGE = "image"
    VIDEO = "video"
    NOTIFICATION = "notification"
    WORKFLOW = "workflow"
    WORKFLOW_INSTANCE = "workflow_instance"
    AUDIT_LOG = "audit_log"
    REPORT = "report"
    ORGANIZATION = "organization"
    PROJECT = "project"
    TAG = "tag"
    CATEGORY = "category"


class SearchIndex(BaseModel):
    """Search index aggregate root."""

    id: UUID
    entity_id: UUID
    entity_type: SearchableType
    title: str
    content: str
    metadata: dict = Field(default_factory=dict)
    tenant_id: UUID | None = None
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class SearchQuery(BaseModel):
    """Search query value object."""

    query: str
    entity_types: list[SearchableType] | None = None
    filters: dict = Field(default_factory=dict)
    limit: int = 20
    offset: int = 0

    class Config:
        """Pydantic config."""

        frozen = True


class SearchResult(BaseModel):
    """Search result value object."""

    id: UUID
    entity_id: UUID
    entity_type: SearchableType
    title: str
    content: str
    score: float
    metadata: dict = Field(default_factory=dict)
    url: str | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class SearchHistory(BaseModel):
    """Search history value object."""

    id: UUID
    user_id: UUID
    query: str
    entity_types: list[SearchableType] | None = None
    results_count: int
    created_at: datetime

    class Config:
        """Pydantic config."""

        frozen = True


class SavedSearch(BaseModel):
    """Saved search value object."""

    id: UUID
    user_id: UUID
    name: str
    query: str
    entity_types: list[SearchableType] | None = None
    filters: dict = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        """Pydantic config."""

        frozen = True