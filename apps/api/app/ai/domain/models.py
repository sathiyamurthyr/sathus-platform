"""AI Gateway domain models."""

from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field


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


class Model(BaseModel):
    """AI Model domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    provider: AIProvider
    name: str
    version: str | None = None
    capabilities: list[ModelCapability] = Field(default_factory=list)
    max_tokens: int | None = None
    cost_per_1k_tokens: float | None = None
    latency_ms: int | None = None
    is_available: bool = True
    status: ModelStatus = ModelStatus.ACTIVE
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class Prompt(BaseModel):
    """Prompt domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    description: str | None = None
    template: str
    variables: list[str] = Field(default_factory=list)
    provider: AIProvider
    model_name: str
    parameters: dict = Field(default_factory=dict)
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    is_public: bool = False
    status: PromptStatus = PromptStatus.DRAFT
    version: int = 1
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class PromptVersion(BaseModel):
    """Prompt version domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    prompt_id: UUID
    version: int
    template: str
    variables: list[str] = Field(default_factory=list)
    parameters: dict = Field(default_factory=dict)
    created_by: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))


class AIRequest(BaseModel):
    """AI Request domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    request_type: AIRequestType
    provider: AIProvider
    model_name: str
    prompt: str
    parameters: dict = Field(default_factory=dict)
    response: str | None = None
    usage: dict = Field(default_factory=dict)
    cost: float | None = None
    status: AIRequestStatus = AIRequestStatus.PENDING
    error_message: str | None = None
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    completed_at: datetime | None = None


class AIUsage(BaseModel):
    """AI Usage domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    provider: AIProvider
    model_name: str
    request_id: UUID
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    cost: float = 0.0
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))


class AIConversation(BaseModel):
    """AI Conversation domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    title: str | None = None
    provider: AIProvider
    model_name: str
    messages: list[dict] = Field(default_factory=list)
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class AIConversationMessage(BaseModel):
    """AI Conversation Message domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    conversation_id: UUID
    role: str
    content: str
    token_count: int | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))


class AIProviderConfig(BaseModel):
    """AI Provider configuration domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    provider: AIProvider
    api_key: str | None = None
    api_base: str | None = None
    organization: str | None = None
    default_model: str | None = None
    is_active: bool = True
    rate_limit_rpm: int = 60
    rate_limit_tpm: int = 90000
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None