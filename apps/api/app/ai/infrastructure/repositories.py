"""AI Gateway repositories."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.infrastructure.models import (
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


class ModelRepository:
    """AI Model repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        provider: AIProvider,
        name: str,
        capabilities: list[ModelCapability],
        version: str | None = None,
        max_tokens: int | None = None,
        cost_per_1k_tokens: float | None = None,
    ) -> Model:
        """Create an AI model."""
        model = Model(
            provider=provider,
            name=name,
            capabilities=capabilities,
            version=version,
            max_tokens=max_tokens,
            cost_per_1k_tokens=cost_per_1k_tokens,
        )
        self.session.add(model)
        await self.session.flush()
        return model

    async def get_by_id(self, model_id: UUID) -> Model | None:
        """Get model by ID."""
        result = await self.session.execute(
            select(Model).where(Model.id == model_id)
        )
        return result.scalar_one_or_none()

    async def get_by_name(
        self,
        provider: AIProvider,
        name: str,
    ) -> Model | None:
        """Get model by name and provider."""
        result = await self.session.execute(
            select(Model).where(
                and_(Model.provider == provider, Model.name == name)
            )
        )
        return result.scalar_one_or_none()

    async def search(
        self,
        provider: AIProvider | None = None,
        capability: ModelCapability | None = None,
        is_available: bool | None = None,
        status: ModelStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[Model], int]:
        """Search models with filters."""
        query = select(Model)
        conditions = []

        if provider:
            conditions.append(Model.provider == provider)
        if is_available is not None:
            conditions.append(Model.is_available == is_available)
        if status:
            conditions.append(Model.status == status)

        if conditions:
            query = query.where(and_(*conditions))

        count_query = select(func.count()).select_from(Model)
        if conditions:
            count_query = count_query.where(and_(*conditions))

        count_result = await self.session.execute(count_query)
        total = count_result.scalar_one()

        query = (
            query
            .order_by(Model.provider, Model.name)
            .limit(limit)
            .offset(offset)
        )

        result = await self.session.execute(query)
        models = list(result.scalars().all())

        return models, total


class PromptRepository:
    """Prompt repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        prompt = Prompt(
            name=name,
            template=template,
            provider=provider,
            model_name=model_name,
            variables=variables or [],
            parameters=parameters or {},
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
        )
        self.session.add(prompt)
        await self.session.flush()
        return prompt

    async def get_by_id(self, prompt_id: UUID) -> Prompt | None:
        """Get prompt by ID."""
        result = await self.session.execute(
            select(Prompt).where(Prompt.id == prompt_id)
        )
        return result.scalar_one_or_none()

    async def search(
        self,
        provider: AIProvider | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool | None = None,
        status: PromptStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[Prompt], int]:
        """Search prompts with filters."""
        query = select(Prompt)
        conditions = []

        if provider:
            conditions.append(Prompt.provider == provider)
        if created_by:
            conditions.append(Prompt.created_by == created_by)
        if tenant_id:
            conditions.append(Prompt.tenant_id == tenant_id)
        if is_public is not None:
            conditions.append(Prompt.is_public == is_public)
        if status:
            conditions.append(Prompt.status == status)

        if conditions:
            query = query.where(and_(*conditions))

        count_query = select(func.count()).select_from(Prompt)
        if conditions:
            count_query = count_query.where(and_(*conditions))

        count_result = await self.session.execute(count_query)
        total = count_result.scalar_one()

        query = (
            query
            .order_by(Prompt.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.session.execute(query)
        prompts = list(result.scalars().all())

        return prompts, total


class AIRequestRepository:
    """AI Request repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        request = AIRequest(
            request_type=request_type,
            provider=provider,
            model_name=model_name,
            prompt=prompt,
            parameters=parameters or {},
            created_by=created_by,
            tenant_id=tenant_id,
        )
        self.session.add(request)
        await self.session.flush()
        return request

    async def get_by_id(self, request_id: UUID) -> AIRequest | None:
        """Get request by ID."""
        result = await self.session.execute(
            select(AIRequest).where(AIRequest.id == request_id)
        )
        return result.scalar_one_or_none()

    async def update(
        self,
        request_id: UUID,
        response: str | None = None,
        usage: dict | None = None,
        cost: float | None = None,
        status: AIRequestStatus | None = None,
        error_message: str | None = None,
        completed_at: datetime | None = None,
    ) -> AIRequest | None:
        """Update an AI request."""
        request = await self.get_by_id(request_id)
        if not request:
            return None

        if response is not None:
            request.response = response
        if usage is not None:
            request.usage = usage
        if cost is not None:
            request.cost = cost
        if status is not None:
            request.status = status
        if error_message is not None:
            request.error_message = error_message
        if completed_at is not None:
            request.completed_at = completed_at

        await self.session.flush()
        return request


class AIUsageRepository:
    """AI Usage repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        provider: AIProvider,
        model_name: str,
        request_id: UUID,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        cost: float = 0.0,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> AIUsage:
        """Create an AI usage record."""
        usage = AIUsage(
            provider=provider,
            model_name=model_name,
            request_id=request_id,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            cost=cost,
            created_by=created_by,
            tenant_id=tenant_id,
        )
        self.session.add(usage)
        await self.session.flush()
        return usage

    async def get_by_request(self, request_id: UUID) -> AIUsage | None:
        """Get usage by request ID."""
        result = await self.session.execute(
            select(AIUsage).where(AIUsage.request_id == request_id)
        )
        return result.scalar_one_or_none()


class AIConversationRepository:
    """AI Conversation repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        provider: AIProvider,
        model_name: str,
        title: str | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> AIConversation:
        """Create a conversation."""
        conversation = AIConversation(
            provider=provider,
            model_name=model_name,
            title=title,
            created_by=created_by,
            tenant_id=tenant_id,
        )
        self.session.add(conversation)
        await self.session.flush()
        return conversation

    async def get_by_id(self, conversation_id: UUID) -> AIConversation | None:
        """Get conversation by ID."""
        result = await self.session.execute(
            select(AIConversation).where(AIConversation.id == conversation_id)
        )
        return result.scalar_one_or_none()

    async def get_active_conversations(
        self,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        limit: int = 50,
    ) -> list[AIConversation]:
        """Get active conversations."""
        query = (
            select(AIConversation)
            .where(AIConversation.is_active == True)
        )

        if created_by:
            query = query.where(AIConversation.created_by == created_by)
        if tenant_id:
            query = query.where(AIConversation.tenant_id == tenant_id)

        query = query.order_by(AIConversation.updated_at.desc()).limit(limit)

        result = await self.session.execute(query)
        return list(result.scalars().all())


class AIProviderConfigRepository:
    """AI Provider Config repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        config = AIProviderConfig(
            provider=provider,
            api_key=api_key,
            api_base=api_base,
            organization=organization,
            default_model=default_model,
            rate_limit_rpm=rate_limit_rpm,
            rate_limit_tpm=rate_limit_tpm,
            created_by=created_by,
            tenant_id=tenant_id,
        )
        self.session.add(config)
        await self.session.flush()
        return config

    async def get_by_provider(
        self,
        provider: AIProvider,
        tenant_id: UUID | None = None,
    ) -> AIProviderConfig | None:
        """Get config by provider."""
        query = select(AIProviderConfig).where(
            AIProviderConfig.provider == provider
        )
        if tenant_id:
            query = query.where(AIProviderConfig.tenant_id == tenant_id)
        else:
            query = query.where(AIProviderConfig.tenant_id.is_(None))

        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_active_configs(self) -> list[AIProviderConfig]:
        """Get all active provider configs."""
        result = await self.session.execute(
            select(AIProviderConfig).where(
                AIProviderConfig.is_active == True
            )
        )
        return list(result.scalars().all())