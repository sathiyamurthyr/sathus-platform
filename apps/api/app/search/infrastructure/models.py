"""Search database models."""

from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class SearchableType(str, Enum):
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


class SearchIndex(Base):
    """Search index database model."""

    __tablename__ = "search_indexes"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    entity_id = Column(
        PostgresUUID(as_uuid=True),
        nullable=False,
    )
    entity_type = Column(SQLEnum(SearchableType), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    search_vector = Column(Text, nullable=True)  # For PostgreSQL full-text search
    search_metadata = Column(Text, nullable=True)  # JSON object
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SearchHistory(Base):
    """Search history database model."""

    __tablename__ = "search_history"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    user_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    query = Column(String(255), nullable=False)
    entity_types = Column(Text, nullable=True)  # JSON array
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SavedSearch(Base):
    """Saved search database model."""

    __tablename__ = "saved_searches"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    user_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    name = Column(String(255), nullable=False)
    query = Column(String(255), nullable=False)
    entity_types = Column(Text, nullable=True)  # JSON array
    filters = Column(Text, nullable=True)  # JSON object
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())