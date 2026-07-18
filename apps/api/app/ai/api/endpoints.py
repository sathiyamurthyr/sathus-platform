"""AI Gateway API endpoints."""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.api.schemas import (
    ModelResponse,
    ModelCreate,
    PromptResponse,
    PromptCreate,
    AIRequestResponse,
    AIRequestCreate,
    AIConversationResponse,
    AIConversationCreate,
    AIProviderConfigResponse,
    AIProviderConfigCreate,
)
from app.ai.application.services import (
    ModelService,
    PromptService,
    AIRequestService,
    AIConversationService,
    AIProviderConfigService,
)
from app.ai.infrastructure.repositories import (
    ModelRepository,
    PromptRepository,
    AIRequestRepository,
    AIUsageRepository,
    AIConversationRepository,
    AIProviderConfigRepository,
)
from app.core.database import get_db

router = APIRouter()


# Model endpoints
async def get_model_service(
    session: AsyncSession = Depends(get_db),
) -> ModelService:
    """Get model service."""
    return ModelService(ModelRepository(session))


@router.post("/models", response_model=ModelResponse, status_code=status.HTTP_201_CREATED)
async def create_model(
    model: ModelCreate,
    service: ModelService = Depends(get_model_service),
) -> ModelResponse:
    """Create an AI model."""
    created = await service.create_model(
        provider=model.provider,
        name=model.name,
        capabilities=model.capabilities,
        version=model.version,
        max_tokens=model.max_tokens,
        cost_per_1k_tokens=model.cost_per_1k_tokens,
    )
    return ModelResponse(
        id=created.id,
        provider=created.provider.value,
        name=created.name,
        version=created.version,
        capabilities=[c.value for c in created.capabilities],
        max_tokens=created.max_tokens,
        cost_per_1k_tokens=created.cost_per_1k_tokens,
        latency_ms=created.latency_ms,
        is_available=created.is_available,
        status=created.status.value,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


# Prompt endpoints
async def get_prompt_service(
    session: AsyncSession = Depends(get_db),
) -> PromptService:
    """Get prompt service."""
    return PromptService(PromptRepository(session))


@router.post("/prompts", response_model=PromptResponse, status_code=status.HTTP_201_CREATED)
async def create_prompt(
    prompt: PromptCreate,
    service: PromptService = Depends(get_prompt_service),
) -> PromptResponse:
    """Create a prompt."""
    created = await service.create_prompt(
        name=prompt.name,
        template=prompt.template,
        provider=prompt.provider,
        model_name=prompt.model_name,
        variables=prompt.variables,
        parameters=prompt.parameters,
        is_public=prompt.is_public,
    )
    return PromptResponse(
        id=created.id,
        name=created.name,
        description=created.description,
        template=created.template,
        variables=created.variables,
        provider=created.provider.value,
        model_name=created.model_name,
        parameters=created.parameters,
        created_by=created.created_by,
        tenant_id=created.tenant_id,
        is_public=created.is_public,
        status=created.status.value,
        version=created.version,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


# AI Request endpoints
async def get_request_service(
    session: AsyncSession = Depends(get_db),
) -> AIRequestService:
    """Get request service."""
    return AIRequestService(
        AIRequestRepository(session),
        AIUsageRepository(session),
    )


@router.post("/requests", response_model=AIRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_request(
    request: AIRequestCreate,
    service: AIRequestService = Depends(get_request_service),
) -> AIRequestResponse:
    """Create an AI request."""
    created = await service.create_request(
        request_type=request.request_type,
        provider=request.provider,
        model_name=request.model_name,
        prompt=request.prompt,
        parameters=request.parameters,
    )
    return AIRequestResponse(
        id=created.id,
        request_type=created.request_type.value,
        provider=created.provider.value,
        model_name=created.model_name,
        prompt=created.prompt,
        parameters=created.parameters,
        response=created.response,
        usage=created.usage,
        cost=created.cost,
        status=created.status.value,
        error_message=created.error_message,
        created_by=created.created_by,
        tenant_id=created.tenant_id,
        created_at=created.created_at,
        completed_at=created.completed_at,
    )


# Conversation endpoints
async def get_conversation_service(
    session: AsyncSession = Depends(get_db),
) -> AIConversationService:
    """Get conversation service."""
    return AIConversationService(AIConversationRepository(session))


@router.post("/conversations", response_model=AIConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation: AIConversationCreate,
    service: AIConversationService = Depends(get_conversation_service),
) -> AIConversationResponse:
    """Create a conversation."""
    created = await service.create_conversation(
        provider=conversation.provider,
        model_name=conversation.model_name,
        title=conversation.title,
    )
    return AIConversationResponse(
        id=created.id,
        title=created.title,
        provider=created.provider.value,
        model_name=created.model_name,
        created_by=created.created_by,
        tenant_id=created.tenant_id,
        is_active=created.is_active,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


# Provider Config endpoints
async def get_config_service(
    session: AsyncSession = Depends(get_db),
) -> AIProviderConfigService:
    """Get config service."""
    return AIProviderConfigService(AIProviderConfigRepository(session))


@router.post("/provider-configs", response_model=AIProviderConfigResponse, status_code=status.HTTP_201_CREATED)
async def create_provider_config(
    config: AIProviderConfigCreate,
    service: AIProviderConfigService = Depends(get_config_service),
) -> AIProviderConfigResponse:
    """Create a provider config."""
    created = await service.create_config(
        provider=config.provider,
        api_key=config.api_key,
        api_base=config.api_base,
        organization=config.organization,
        default_model=config.default_model,
        rate_limit_rpm=config.rate_limit_rpm,
        rate_limit_tpm=config.rate_limit_tpm,
    )
    return AIProviderConfigResponse(
        id=created.id,
        provider=created.provider.value,
        api_key=created.api_key,
        api_base=created.api_base,
        organization=created.organization,
        default_model=created.default_model,
        is_active=created.is_active,
        rate_limit_rpm=created.rate_limit_rpm,
        rate_limit_tpm=created.rate_limit_tpm,
        created_by=created.created_by,
        tenant_id=created.tenant_id,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )