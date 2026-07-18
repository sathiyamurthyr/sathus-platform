"""Content domain models."""

from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field


class ContentStatus(StrEnum):
    """Content status enumeration."""

    DRAFT = "draft"
    REVIEW = "review"
    APPROVED = "approved"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    DELETED = "deleted"


class ContentType(BaseModel):
    """Content type model."""

    id: UUID
    name: str
    description: str | None = None
    is_system: bool = False

    class Config:
        """Pydantic config."""

        frozen = True


class ContentSlug(BaseModel):
    """Content slug model."""

    id: UUID
    slug: str
    content_item_id: UUID
    is_primary: bool = True
    redirect_to: str | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class SeoMetadata(BaseModel):
    """SEO metadata model."""

    id: UUID
    meta_title: str | None = None
    meta_description: str | None = None
    canonical: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None
    twitter_card: str | None = None
    twitter_title: str | None = None
    twitter_description: str | None = None
    reading_time: int | None = None
    schema_type: str | None = None
    focus_keyword: str | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class ContentSection(BaseModel):
    """Content section model."""

    id: UUID
    content_item_id: UUID
    title: str
    content: str
    order: int = 0

    class Config:
        """Pydantic config."""

        frozen = True


class ContentBlock(BaseModel):
    """Content block model."""

    id: UUID
    section_id: UUID
    block_type: str
    content: dict
    order: int = 0

    class Config:
        """Pydantic config."""

        frozen = True


class ContentVersion(BaseModel):
    """Content version model."""

    id: UUID
    content_item_id: UUID
    version_number: int
    title: str
    slug: str
    content: str
    status: ContentStatus
    created_by: UUID
    created_at: str

    class Config:
        """Pydantic config."""

        frozen = True


class ContentCategory(BaseModel):
    """Content category model."""

    id: UUID
    name: str
    slug: str
    description: str | None = None
    parent_id: UUID | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class ContentTag(BaseModel):
    """Content tag model."""

    id: UUID
    name: str
    slug: str

    class Config:
        """Pydantic config."""

        frozen = True


class ContentRelation(BaseModel):
    """Content relation model."""

    id: UUID
    source_item_id: UUID
    target_item_id: UUID
    relation_type: str

    class Config:
        """Pydantic config."""

        frozen = True


class ContentAuthor(BaseModel):
    """Content author model."""

    id: UUID
    content_item_id: UUID
    user_id: UUID
    role: str

    class Config:
        """Pydantic config."""

        frozen = True


class ContentItem(BaseModel):
    """Content item model."""

    id: UUID
    type_id: UUID
    title: str
    slug: str
    content: str
    status: ContentStatus
    seo_metadata: SeoMetadata | None = None
    categories: list[ContentCategory] = Field(default_factory=list)
    tags: list[ContentTag] = Field(default_factory=list)
    relations: list[ContentRelation] = Field(default_factory=list)
    authors: list[ContentAuthor] = Field(default_factory=list)
    created_at: str
    updated_at: str | None = None
    published_at: str | None = None

    class Config:
        """Pydantic config."""

        frozen = True