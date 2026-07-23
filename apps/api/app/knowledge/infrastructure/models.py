"""Knowledge database models for EPIC-028 (Prompts 01 & 02)."""

from enum import Enum
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB, UUID as PostgresUUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class SourceStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SYNCING = "syncing"
    ERROR = "error"


class DocumentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    PARSED = "parsed"
    INDEXED = "indexed"
    ARCHIVED = "archived"
    ERROR = "error"


class KnowledgeSource(Base):
    """Knowledge source configuration model."""

    __tablename__ = "knowledge_sources"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    connector_type = Column(String(50), nullable=False, index=True)  # S3, Local, API, Web, Database
    status = Column(SQLEnum(SourceStatus), default=SourceStatus.ACTIVE, index=True)
    configuration = Column(JSONB, default=dict)
    sync_frequency = Column(String(50), default="hourly")
    last_synced_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    documents = relationship("KnowledgeDocument", back_populates="source", cascade="all, delete-orphan")


class KnowledgeDocument(Base):
    """Enterprise document model."""

    __tablename__ = "knowledge_documents"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    source_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_sources.id"), nullable=True, index=True)
    collection_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_collections.id"), nullable=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    file_path = Column(String(1000), nullable=False)
    file_type = Column(String(50), nullable=False, index=True)  # pdf, docx, xlsx, pptx, md, html, csv, txt, json, xml, image
    file_size_bytes = Column(Integer, default=0)
    hash_checksum = Column(String(64), nullable=True, index=True)
    language = Column(String(10), default="en")
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.PENDING, index=True)
    version = Column(Integer, default=1)
    is_archived = Column(Boolean, default=False, index=True)
    parent_document_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_documents.id"), nullable=True)
    created_by = Column(PostgresUUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    source = relationship("KnowledgeSource", back_populates="documents")
    collection = relationship("KnowledgeCollection", back_populates="documents")
    chunks = relationship("KnowledgeChunk", back_populates="document", cascade="all, delete-orphan")
    metadata_entries = relationship("KnowledgeMetadata", back_populates="document", cascade="all, delete-orphan")
    versions = relationship("KnowledgeVersion", back_populates="document", cascade="all, delete-orphan")


class KnowledgeCollection(Base):
    """Knowledge collection / space model."""

    __tablename__ = "knowledge_collections"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    parent_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_collections.id"), nullable=True)
    is_public = Column(Boolean, default=False)
    created_by = Column(PostgresUUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    documents = relationship("KnowledgeDocument", back_populates="collection")


class KnowledgeVersion(Base):
    """Document version history snapshot."""

    __tablename__ = "knowledge_versions"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    document_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_documents.id"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False)
    change_summary = Column(Text, nullable=True)
    content_hash = Column(String(64), nullable=False)
    created_by = Column(PostgresUUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("KnowledgeDocument", back_populates="versions")


class KnowledgeMetadata(Base):
    """Extracted metadata key-value record."""

    __tablename__ = "knowledge_metadata"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    document_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_documents.id"), nullable=False, index=True)
    key = Column(String(100), nullable=False, index=True)
    value = Column(Text, nullable=False)
    data_type = Column(String(50), default="string")
    confidence = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("KnowledgeDocument", back_populates="metadata_entries")


class KnowledgeChunk(Base):
    """Document chunk partition for search & context."""

    __tablename__ = "knowledge_chunks"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    document_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_documents.id"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    token_count = Column(Integer, default=0)
    start_char = Column(Integer, default=0)
    end_char = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("KnowledgeDocument", back_populates="chunks")


class KnowledgeTag(Base):
    """Knowledge taxonomy tag."""

    __tablename__ = "knowledge_tags"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(100), nullable=False, index=True)
    category = Column(String(100), default="general", index=True)
    color = Column(String(20), default="#6366f1")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class KnowledgeEvent(Base):
    """Event-driven audit stream item."""

    __tablename__ = "knowledge_events"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    event_type = Column(String(100), nullable=False, index=True)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(PostgresUUID(as_uuid=True), nullable=False)
    payload = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


class KnowledgePermission(Base):
    """Granular knowledge permission matrix."""

    __tablename__ = "knowledge_permissions"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    principal_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)  # user_id or role_id
    principal_type = Column(String(50), nullable=False)  # user or role
    resource_type = Column(String(50), nullable=False)  # collection, document, space
    resource_id = Column(PostgresUUID(as_uuid=True), nullable=False)
    permission = Column(String(50), nullable=False)  # read, write, admin, owner
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class KnowledgeImportJob(Base):
    """Asynchronous import/export job tracking."""

    __tablename__ = "knowledge_import_jobs"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    job_type = Column(String(50), nullable=False)  # import or export
    status = Column(String(50), default="pending", index=True)  # pending, processing, completed, failed
    processed_count = Column(Integer, default=0)
    total_count = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    metadata_payload = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)


# ==========================================
# PROMPT 02: GRAPH, SEARCH & CONTEXT ENGINE
# ==========================================


class KnowledgeEntity(Base):
    """Domain entity model."""

    __tablename__ = "knowledge_entities"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    entity_type = Column(String(100), nullable=False, index=True)  # Organization, Person, Product, Concept, Location
    description = Column(Text, nullable=True)
    confidence = Column(Float, default=1.0)
    attributes = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class KnowledgeRelationship(Base):
    """Typed relationship between entities."""

    __tablename__ = "knowledge_relationships"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    source_entity_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_entities.id"), nullable=False, index=True)
    target_entity_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_entities.id"), nullable=False, index=True)
    relation_type = Column(String(100), nullable=False, index=True)  # OWNS, CONTAINS, DEPENDS_ON, USES, RELATED_TO
    weight = Column(Float, default=1.0)
    confidence = Column(Float, default=1.0)
    properties = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class OntologyModel(Base):
    """Business glossary & class ontology."""

    __tablename__ = "ontology_models"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    version = Column(String(50), default="1.0.0")
    schema_definition = Column(JSONB, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class GraphNode(Base):
    """Generic graph node for traversals."""

    __tablename__ = "graph_nodes"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    label = Column(String(255), nullable=False, index=True)
    node_type = Column(String(100), nullable=False, index=True)
    properties = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class GraphEdge(Base):
    """Generic graph edge for traversals."""

    __tablename__ = "graph_edges"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    source_node_id = Column(PostgresUUID(as_uuid=True), ForeignKey("graph_nodes.id"), nullable=False, index=True)
    target_node_id = Column(PostgresUUID(as_uuid=True), ForeignKey("graph_nodes.id"), nullable=False, index=True)
    edge_type = Column(String(100), nullable=False, index=True)
    weight = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SemanticIndex(Base):
    """Semantic vector & keyword index metadata."""

    __tablename__ = "semantic_indexes"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    index_name = Column(String(255), nullable=False, index=True)
    dimension = Column(Integer, default=1536)
    metric = Column(String(50), default="cosine")
    total_vectors = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SearchEmbedding(Base):
    """Vector search embedding entry."""

    __tablename__ = "search_embeddings"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    chunk_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_chunks.id"), nullable=True, index=True)
    entity_id = Column(PostgresUUID(as_uuid=True), ForeignKey("knowledge_entities.id"), nullable=True, index=True)
    model_name = Column(String(100), default="text-embedding-3-small")
    embedding_vector = Column(JSONB, nullable=False)  # Store vector array
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContextProfile(Base):
    """Context profile scope configuration."""

    __tablename__ = "context_profiles"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    scope = Column(String(50), nullable=False, index=True)  # tenant, org, workspace, user, workflow, project
    max_tokens = Column(Integer, default=128000)
    settings = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContextWindow(Base):
    """Active LLM context window tracking."""

    __tablename__ = "context_windows"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    session_id = Column(String(255), nullable=False, index=True)
    allocated_tokens = Column(Integer, default=0)
    max_limit = Column(Integer, default=128000)
    window_data = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ContextCache(Base):
    """Compressed context cache storage."""

    __tablename__ = "context_cache"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    cache_key = Column(String(255), nullable=False, unique=True, index=True)
    compressed_content = Column(Text, nullable=False)
    token_count = Column(Integer, default=0)
    ttl_seconds = Column(Integer, default=3600)
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
