"""AI Gateway application services."""

from datetime import datetime
from uuid import UUID

from app.ai.domain.models import (
    Model,
    Prompt,
    PromptVersion,
    AIRequest,
    AIUsage,
    AIConversation,
    AIConversationMessage,
    AIProviderConfig,
    AIProvider,
    ModelCapability,
    ModelStatus,
    PromptStatus,
    AIRequestType,
    AIRequestStatus,
)
from app.ai.infrastructure.models import (
    Model as ModelModel,
    Prompt as PromptModel,
    PromptVersion as PromptVersionModel,
    AIRequest as AIRequestModel,
    AIUsage as AIUsageModel,
    AIConversation as AIConversationModel,
    AIConversationMessage as AIConversationMessageModel,
    AIProviderConfig as AIProviderConfigModel,
    AIProvider as AIProviderModel,
    ModelCapability as ModelCapabilityModel,
    ModelStatus as ModelStatusModel,
    PromptStatus as PromptStatusModel,
    AIRequestType as AIRequestTypeModel,
    AIRequestStatus as AIRequestStatusModel,
)
from app.ai.infrastructure.repositories import (
    ModelRepository,
    PromptRepository,
    AIRequestRepository,
    AIUsageRepository,
    AIConversationRepository,
    AIProviderConfigRepository,
)
from app.core.logging import logger


class ModelService:
    """Model service."""

    def __init__(self, model_repo: ModelRepository):
        """Initialize service."""
        self.model_repo = model_repo

    async def create_model(
        self,
        provider: AIProvider,
        name: str,
        capabilities: list[ModelCapability],
        version: str | None = None,
        max_tokens: int | None = None,
        cost_per_1k_tokens: float | None = None,
    ) -> Model:
        """Create an AI model."""
        model = await self.model_repo.create(
            provider=AIProviderModel(provider.value),
            name=name,
            capabilities=[ModelCapabilityModel(c.value) for c in capabilities],
            version=version,
            max_tokens=max_tokens,
            cost_per_1k_tokens=cost_per_1k_tokens,
        )

        logger.info(f"AI Model created: {model.id}")

        return Model(
            id=model.id,
            provider=provider,
            name=model.name,
            version=model.version,
            capabilities=capabilities,
            max_tokens=model.max_tokens,
            cost_per_1k_tokens=model.cost_per_1k_tokens,
            latency_ms=model.latency_ms,
            is_available=model.is_available,
            status=ModelStatus(model.status.value),
            created_at=model.created_at,
            updated_at=model.updated_at,
        )


class PromptService:
    """Prompt service."""

    def __init__(self, prompt_repo: PromptRepository):
        """Initialize service."""
        self.prompt_repo = prompt_repo

    async def create_prompt(
        self,
        name: str,
        template: str,
        provider: AIProvider,
        model_name: str,
        variables: list[str] | None = None,
        parameters: dict | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool = False,
    ) -> Prompt:
        """Create a prompt."""
        prompt = await self.prompt_repo.create(
            name=name,
            template=template,
            provider=AIProviderModel(provider.value),
            model_name=model_name,
            variables=variables,
            parameters=parameters,
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
        )

        logger.info(f"Prompt created: {prompt.id}")

        return Prompt(
            id=prompt.id,
            name=prompt.name,
            description=prompt.description,
            template=prompt.template,
            variables=prompt.variables,
            provider=provider,
            model_name=prompt.model_name,
            parameters=prompt.parameters,
            created_by=prompt.created_by,
            tenant_id=prompt.tenant_id,
            is_public=prompt.is_public,
            status=PromptStatus(prompt.status.value),
            version=prompt.version,
            created_at=prompt.created_at,
            updated_at=prompt.updated_at,
        )


class AIRequestService:
    """AI Request service."""

    def __init__(self, request_repo: AIRequestRepository, usage_repo: AIUsageRepository):
        """Initialize service."""
        self.request_repo = request_repo
        self.usage_repo = usage_repo

    async def create_request(
        self,
        request_type: AIRequestType,
        provider: AIProvider,
        model_name: str,
        prompt: str,
        parameters: dict | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> AIRequest:
        """Create an AI request."""
        request = await self.request_repo.create(
            request_type=AIRequestTypeModel(request_type.value),
            provider=AIProviderModel(provider.value),
            model_name=model_name,
            prompt=prompt,
            parameters=parameters,
            created_by=created_by,
            tenant_id=tenant_id,
        )

        logger.info(f"AI Request created: {request.id}")

        return AIRequest(
            id=request.id,
            request_type=request_type,
            provider=provider,
            model_name=request.model_name,
            prompt=request.prompt,
            parameters=request.parameters,
            response=request.response,
            usage=request.usage,
            cost=request.cost,
            status=AIRequestStatus(request.status.value),
            error_message=request.error_message,
            created_by=request.created_by,
            tenant_id=request.tenant_id,
            created_at=request.created_at,
            completed_at=request.completed_at,
        )

    async def complete_request(
        self,
        request_id: UUID,
        response: str,
        usage: dict,
        cost: float,
    ) -> AIRequest:
        """Complete an AI request."""
        request = await self.request_repo.update(
            request_id=request_id,
            response=response,
            usage=usage,
            cost=cost,
            status=AIRequestStatus.COMPLETED,
            completed_at=datetime.now(datetime.timezone.utc),
        )

        if request:
            logger.info(f"AI Request completed: {request_id}")

        return AIRequest(
            id=request.id,
            request_type=AIRequestType(request.request_type.value),
            provider=AIProvider(request.provider.value),
            model_name=request.model_name,
            prompt=request.prompt,
            parameters=request.parameters,
            response=request.response,
            usage=request.usage,
            cost=request.cost,
            status=AIRequestStatus(request.status.value),
            error_message=request.error_message,
            created_by=request.created_by,
            tenant_id=request.tenant_id,
            created_at=request.created_at,
            completed_at=request.completed_at,
        )


class AIConversationService:
    """AI Conversation service."""

    def __init__(self, conversation_repo: AIConversationRepository):
        """Initialize service."""
        self.conversation_repo = conversation_repo

    async def create_conversation(
        self,
        provider: AIProvider,
        model_name: str,
        title: str | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> AIConversation:
        """Create a conversation."""
        conversation = await self.conversation_repo.create(
            provider=AIProviderModel(provider.value),
            model_name=model_name,
            title=title,
            created_by=created_by,
            tenant_id=tenant_id,
        )

        logger.info(f"AI Conversation created: {conversation.id}")

        return AIConversation(
            id=conversation.id,
            title=conversation.title,
            provider=provider,
            model_name=conversation.model_name,
            messages=conversation.messages,
            created_by=conversation.created_by,
            tenant_id=conversation.tenant_id,
            is_active=conversation.is_active,
            created_at=conversation.created_at,
            updated_at=conversation.updated_at,
        )


class AIProviderConfigService:
    """AI Provider Config service."""

    def __init__(self, config_repo: AIProviderConfigRepository):
        """Initialize service."""
        self.config_repo = config_repo

    async def create_config(
        self,
        provider: AIProvider,
        api_key: str | None = None,
        api_base: str | None = None,
        organization: str | None = None,
        default_model: str | None = None,
        rate_limit_rpm: int = 60,
        rate_limit_tpm: int = 90000,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> AIProviderConfig:
        """Create a provider config."""
        config = await self.config_repo.create(
            provider=AIProviderModel(provider.value),
            api_key=api_key,
            api_base=api_base,
            organization=organization,
            default_model=default_model,
            rate_limit_rpm=rate_limit_rpm,
            rate_limit_tpm=rate_limit_tpm,
            created_by=created_by,
            tenant_id=tenant_id,
        )

        logger.info(f"AI Provider Config created: {config.id}")

        return AIProviderConfig(
            id=config.id,
            provider=provider,
            api_key=config.api_key,
            api_base=config.api_base,
            organization=config.organization,
            default_model=config.default_model,
            is_active=config.is_active,
            rate_limit_rpm=config.rate_limit_rpm,
            rate_limit_tpm=config.rate_limit_tpm,
            created_by=config.created_by,
            tenant_id=config.tenant_id,
            created_at=config.created_at,
            updated_at=config.updated_at,
        )