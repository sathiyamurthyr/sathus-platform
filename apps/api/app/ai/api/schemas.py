"""AI Gateway API schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.ai.domain.models import (
    AIProvider,
    ModelCapability,
    ModelStatus,
    PromptStatus,
    AIRequestType,
    AIRequestStatus,
)


class ModelResponse(BaseModel):
    """Model response schema."""

    id: UUID
    provider: str
    name: str
    version: str | None = None
    capabilities: list[str]
    max_tokens: int | None = None
    cost_per_1k_tokens: float | None = None
    latency_ms: int | None = None
    is_available: bool
    status: str
    created_at: datetime
    updated_at: datetime | None = None


class ModelCreate(BaseModel):
    """Model create schema."""

    provider: AIProvider
    name: str
    capabilities: list[ModelCapability]
    version: str | None = None
    max_tokens: int | None = None
    cost_per_1k_tokens: float | None = None


class PromptResponse(BaseModel):
    """Prompt response schema."""

    id: UUID
    name: str
    description: str | None = None
    template: str
    variables: list[str]
    provider: str
    model_name: str
    parameters: dict
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    is_public: bool
    status: str
    version: int
    created_at: datetime
    updated_at: datetime | None = None


class PromptCreate(BaseModel):
    """Prompt create schema."""

    name: str
    description: str | None = None
    template: str
    provider: AIProvider
    model_name: str
    variables: list[str] = Field(default_factory=list)
    parameters: dict = Field(default_factory=dict)
    is_public: bool = False


class AIRequestResponse(BaseModel):
    """AI Request response schema."""

    id: UUID
    request_type: str
    provider: str
    model_name: str
    prompt: str
    parameters: dict
    response: str | None = None
    usage: dict
    cost: float | None = None
    status: str
    error_message: str | None = None
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    created_at: datetime
    completed_at: datetime | None = None


class AIRequestCreate(BaseModel):
    """AI Request create schema."""

    request_type: AIRequestType
    provider: AIProvider
    model_name: str
    prompt: str
    parameters: dict = Field(default_factory=dict)


class AIConversationResponse(BaseModel):
    """AI Conversation response schema."""

    id: UUID
    title: str | None = None
    provider: str
    model_name: str
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime | None = None


class AIConversationCreate(BaseModel):
    """AI Conversation create schema."""

    provider: AIProvider
    model_name: str
    title: str | None = None


class AIProviderConfigResponse(BaseModel):
    """AI Provider Config response schema."""

    id: UUID
    provider: str
    api_key: str | None = None
    api_base: str | None = None
    organization: str | None = None
    default_model: str | None = None
    is_active: bool
    rate_limit_rpm: int
    rate_limit_tpm: int
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    created_at: datetime
    updated_at: datetime | None = None


class AIProviderConfigCreate(BaseModel):
    """AI Provider Config create schema."""

    provider: AIProvider
    api_key: str | None = None
    api_base: str | None = None
    organization: str | None = None
    default_model: str | None = None
    rate_limit_rpm: int = 60
    rate_limit_tpm: int = 90000