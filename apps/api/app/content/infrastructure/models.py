"""Content database models."""

from enum import StrEnum
from uuid import UUID

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Integer,
    String,
    Text,
    Table,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base


class ContentStatus(StrEnum):
    """Content status enumeration."""

    DRAFT = "draft"
    REVIEW = "review"
    APPROVED = "approved"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    DELETED = "deleted"


class ContentType(Base):
    """Content type database model."""

    __tablename__ = "content_types"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    is_system = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ContentItem(Base):
    """Content item database model."""

    __tablename__ = "content_items"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    type_id = Column(PostgresUUID(as_uuid=True), ForeignKey("content_types.id"), nullable=False)
    title = Column(String(500), nullable=False)
    slug = Column(String(500), nullable=False)
    content = Column(Text, nullable=True)
    status = Column(SQLEnum(ContentStatus), default=ContentStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    type = relationship("ContentType")
    seo = relationship("SeoMetadata", uselist=False, back_populates="content_item")


class SeoMetadata(Base):
    """SEO metadata database model."""

    __tablename__ = "seo_metadata"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    content_item_id = Column(
        PostgresUUID(as_uuid=True), ForeignKey("content_items.id"), nullable=False
    )
    meta_title = Column(String(200), nullable=True)
    meta_description = Column(String(500), nullable=True)
    canonical = Column(String(500), nullable=True)
    og_title = Column(String(200), nullable=True)
    og_description = Column(String(500), nullable=True)
    og_image = Column(String(500), nullable=True)
    twitter_card = Column(String(50), nullable=True)
    twitter_title = Column(String(200), nullable=True)
    twitter_description = Column(String(500), nullable=True)
    reading_time = Column(Integer, nullable=True)
    schema_type = Column(String(100), nullable=True)
    focus_keyword = Column(String(100), nullable=True)

    content_item = relationship("ContentItem", back_populates="seo")


class ContentVersion(Base):
    """Content version database model."""

    __tablename__ = "content_versions"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    content_item_id = Column(
        PostgresUUID(as_uuid=True), ForeignKey("content_items.id"), nullable=False
    )
    version_number = Column(Integer, nullable=False)
    title = Column(String(500), nullable=False)
    slug = Column(String(500), nullable=False)
    content = Column(Text, nullable=True)
    status = Column(SQLEnum(ContentStatus), nullable=False)
    created_by = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    content_item = relationship("ContentItem")


class ContentCategory(Base):
    """Content category database model."""

    __tablename__ = "content_categories"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    parent_id = Column(PostgresUUID(as_uuid=True), ForeignKey("content_categories.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# Association tables
content_item_categories = Table(
    "content_item_categories",
    Base.metadata,
    Column("content_item_id", PostgresUUID(as_uuid=True), ForeignKey("content_items.id"), primary_key=True),
    Column("category_id", PostgresUUID(as_uuid=True), ForeignKey("content_categories.id"), primary_key=True),
)

content_item_tags = Table(
    "content_item_tags",
    Base.metadata,
    Column("content_item_id", PostgresUUID(as_uuid=True), ForeignKey("content_items.id"), primary_key=True),
    Column("tag_id", PostgresUUID(as_uuid=True), ForeignKey("content_tags.id"), primary_key=True),
)

content_relations = Table(
    "content_relations",
    Base.metadata,
    Column("id", PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()),
    Column("source_item_id", PostgresUUID(as_uuid=True), ForeignKey("content_items.id"), nullable=False),
    Column("target_item_id", PostgresUUID(as_uuid=True), ForeignKey("content_items.id"), nullable=False),
    Column("relation_type", String(50), nullable=False),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)

content_authors = Table(
    "content_authors",
    Base.metadata,
    Column("id", PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()),
    Column("content_item_id", PostgresUUID(as_uuid=True), ForeignKey("content_items.id"), nullable=False),
    Column("user_id", PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False),
    Column("role", String(50), nullable=False),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)

slug_history = Table(
    "slug_history",
    Base.metadata,
    Column("id", PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()),
    Column("content_item_id", PostgresUUID(as_uuid=True), ForeignKey("content_items.id"), nullable=False),
    Column("slug", String(500), nullable=False),
    Column("is_primary", Boolean, default=False),
    Column("redirect_to", String(500), nullable=True),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)


class ContentTag(Base):
    """Content tag database model."""

    __tablename__ = "content_tags"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())