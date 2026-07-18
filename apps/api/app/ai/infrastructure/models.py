"""AI Gateway database models."""

from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    String,
    Text,
    Boolean,
    Integer,
    Float,
    func,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID

from app.core.database import Base


class AIProvider(str, Enum):
    """AI provider enumeration."""

    OPENAI = "openai"
    AZURE_OPENAI = "azure_openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"
    OLLAMA = "ollama"
    BEDROCK = "bedrock"


class ModelCapability(str, Enum):
    """Model capability enumeration."""

    TEXT_GENERATION = "text_generation"
    CHAT = "chat"
    EMBEDDINGS = "embeddings"
    IMAGE_GENERATION = "image_generation"
    IMAGE_VISION = "image_vision"
    AUDIO_TRANSCRIPTION = "audio_transcription"
    AUDIO_SPEECH = "audio_speech"
    FUNCTION_CALLING = "function_calling"


class ModelStatus(str, Enum):
    """Model status enumeration."""

    ACTIVE = "active"
    INACTIVE = "inactive"
    DEPRECATED = "deprecated"
    MAINTENANCE = "maintenance"


class PromptStatus(str, Enum):
    """Prompt status enumeration."""

    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"


class AIRequestType(str, Enum):
    """AI request type enumeration."""

    COMPLETION = "completion"
    CHAT = "chat"
    EMBEDDING = "embedding"
    IMAGE = "image"
    AUDIO = "audio"


class AIRequestStatus(str, Enum):
    """AI request status enumeration."""

    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Model(Base):
    """AI Model database model."""

    __tablename__ = "ai_models"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    provider = Column(SQLEnum(AIProvider), nullable=False)
    name = Column(String(255), nullable=False)
    version = Column(String(50), nullable=True)
    capabilities = Column(Text, nullable=False, default="[]")  # JSON array
    max_tokens = Column(Integer, nullable=True)
    cost_per_1k_tokens = Column(Float, nullable=True)
    latency_ms = Column(Integer, nullable=True)
    is_available = Column(Boolean, nullable=False, default=True)
    status = Column(SQLEnum(ModelStatus), nullable=False, default=ModelStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Prompt(Base):
    """Prompt database model."""

    __tablename__ = "ai_prompts"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    template = Column(Text, nullable=False)
    variables = Column(Text, nullable=False, default="[]")  # JSON array
    provider = Column(SQLEnum(AIProvider), nullable=False)
    model_name = Column(String(255), nullable=False)
    parameters = Column(Text, nullable=False, default="{}")  # JSON
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    is_public = Column(Boolean, nullable=False, default=False)
    status = Column(SQLEnum(PromptStatus), nullable=False, default=PromptStatus.DRAFT)
    version = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PromptVersion(Base):
    """Prompt version database model."""

    __tablename__ = "ai_prompt_versions"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    prompt_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("ai_prompts.id"),
        nullable=False,
    )
    version = Column(Integer, nullable=False)
    template = Column(Text, nullable=False)
    variables = Column(Text, nullable=False, default="[]")  # JSON array
    parameters = Column(Text, nullable=False, default="{}")  # JSON
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AIRequest(Base):
    """AI Request database model."""

    __tablename__ = "ai_requests"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    request_type = Column(SQLEnum(AIRequestType), nullable=False)
    provider = Column(SQLEnum(AIProvider), nullable=False)
    model_name = Column(String(255), nullable=False)
    prompt = Column(Text, nullable=False)
    parameters = Column(Text, nullable=False, default="{}")  # JSON
    response = Column(Text, nullable=True)
    usage = Column(Text, nullable=False, default="{}")  # JSON
    cost = Column(Float, nullable=True)
    status = Column(SQLEnum(AIRequestStatus), nullable=False, default=AIRequestStatus.PENDING)
    error_message = Column(Text, nullable=True)
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)


class AIUsage(Base):
    """AI Usage database model."""

    __tablename__ = "ai_usage"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    provider = Column(SQLEnum(AIProvider), nullable=False)
    model_name = Column(String(255), nullable=False)
    request_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("ai_requests.id"),
        nullable=False,
    )
    prompt_tokens = Column(Integer, nullable=False, default=0)
    completion_tokens = Column(Integer, nullable=False, default=0)
    total_tokens = Column(Integer, nullable=False, default=0)
    cost = Column(Float, nullable=False, default=0.0)
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AIConversation(Base):
    """AI Conversation database model."""

    __tablename__ = "ai_conversations"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    title = Column(String(255), nullable=True)
    provider = Column(SQLEnum(AIProvider), nullable=False)
    model_name = Column(String(255), nullable=False)
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AIConversationMessage(Base):
    """AI Conversation Message database model."""

    __tablename__ = "ai_conversation_messages"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    conversation_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("ai_conversations.id"),
        nullable=False,
    )
    role = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    token_count = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AIProviderConfig(Base):
    """AI Provider configuration database model."""

    __tablename__ = "ai_provider_configs"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    provider = Column(SQLEnum(AIProvider), nullable=False)
    api_key = Column(Text, nullable=True)
    api_base = Column(String(500), nullable=True)
    organization = Column(String(255), nullable=True)
    default_model = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    rate_limit_rpm = Column(Integer, nullable=False, default=60)
    rate_limit_tpm = Column(Integer, nullable=False, default=90000)
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())