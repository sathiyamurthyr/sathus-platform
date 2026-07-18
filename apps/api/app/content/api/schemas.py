"""Content API schemas."""

from uuid import UUID

from pydantic import BaseModel


class ContentItemResponse(BaseModel):
    """Content item response schema."""

    id: UUID
    type_id: UUID
    title: str
    slug: str
    content: str | None = None
    status: str


class ContentItemCreateRequest(BaseModel):
    """Content item creation request."""

    type_id: UUID
    title: str
    slug: str
    content: str | None = None


class ContentItemUpdateRequest(BaseModel):
    """Content item update request."""

    title: str | None = None
    slug: str | None = None
    content: str | None = None
    status: str | None = None


class SeoMetadataResponse(BaseModel):
    """SEO metadata response schema."""

    id: UUID
    content_item_id: UUID
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


class SeoMetadataCreateRequest(BaseModel):
    """SEO metadata creation request."""

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


class ContentTypeResponse(BaseModel):
    """Content type response schema."""

    id: UUID
    name: str
    description: str | None = None


class CategoryResponse(BaseModel):
    """Category response schema."""

    id: UUID
    name: str
    slug: str
    description: str | None = None


class TagResponse(BaseModel):
    """Tag response schema."""

    id: UUID
    name: str
    slug: str


class ContentVersionResponse(BaseModel):
    """Content version response schema."""

    id: UUID
    content_item_id: UUID
    version_number: int
    title: str
    slug: str
    content: str | None = None
    status: str
    created_by: UUID
    created_at: str