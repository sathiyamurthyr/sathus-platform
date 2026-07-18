"""AI Gateway tests."""

import pytest
from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.ai.domain.models import (
    AIProvider,
    ModelCapability,
    ModelStatus,
    PromptStatus,
    AIRequestType,
    AIRequestStatus,
    Model,
    Prompt,
    PromptVersion,
    AIRequest,
    AIUsage,
    AIConversation,
    AIConversationMessage,
    AIProviderConfig,
)


# Enum Tests
class TestAIProvider:
    """Test AIProvider enum."""

    def test_ai_provider_values(self):
        """Test AI provider enum values."""
        assert AIProvider.OPENAI == "openai"
        assert AIProvider.AZURE_OPENAI == "azure_openai"
        assert AIProvider.ANTHROPIC == "anthropic"
        assert AIProvider.GEMINI == "gemini"
        assert AIProvider.OLLAMA == "ollama"
        assert AIProvider.BEDROCK == "bedrock"


class TestModelCapability:
    """Test ModelCapability enum."""

    def test_model_capability_values(self):
        """Test model capability enum values."""
        assert ModelCapability.TEXT_GENERATION == "text_generation"
        assert ModelCapability.CHAT == "chat"
        assert ModelCapability.EMBEDDINGS == "embeddings"
        assert ModelCapability.IMAGE_GENERATION == "image_generation"
        assert ModelCapability.IMAGE_VISION == "image_vision"
        assert ModelCapability.AUDIO_TRANSCRIPTION == "audio_transcription"
        assert ModelCapability.AUDIO_SPEECH == "audio_speech"
        assert ModelCapability.FUNCTION_CALLING == "function_calling"


class TestModelStatus:
    """Test ModelStatus enum."""

    def test_model_status_values(self):
        """Test model status enum values."""
        assert ModelStatus.ACTIVE == "active"
        assert ModelStatus.INACTIVE == "inactive"
        assert ModelStatus.DEPRECATED == "deprecated"
        assert ModelStatus.MAINTENANCE == "maintenance"


class TestPromptStatus:
    """Test PromptStatus enum."""

    def test_prompt_status_values(self):
        """Test prompt status enum values."""
        assert PromptStatus.DRAFT == "draft"
        assert PromptStatus.ACTIVE == "active"
        assert PromptStatus.INACTIVE == "inactive"
        assert PromptStatus.ARCHIVED == "archived"


class TestAIRequestType:
    """Test AIRequestType enum."""

    def test_ai_request_type_values(self):
        """Test AI request type enum values."""
        assert AIRequestType.COMPLETION == "completion"
        assert AIRequestType.CHAT == "chat"
        assert AIRequestType.EMBEDDING == "embedding"
        assert AIRequestType.IMAGE == "image"
        assert AIRequestType.AUDIO == "audio"


class TestAIRequestStatus:
    """Test AIRequestStatus enum."""

    def test_ai_request_status_values(self):
        """Test AI request status enum values."""
        assert AIRequestStatus.PENDING == "pending"
        assert AIRequestStatus.PROCESSING == "processing"
        assert AIRequestStatus.COMPLETED == "completed"
        assert AIRequestStatus.FAILED == "failed"
        assert AIRequestStatus.CANCELLED == "cancelled"


# Domain Model Tests
class TestModel:
    """Test Model domain model."""

    def test_create_model(self):
        """Test creating a model."""
        model = Model(
            id=uuid4(),
            provider=AIProvider.OPENAI,
            name="gpt-4",
            capabilities=[ModelCapability.CHAT, ModelCapability.TEXT_GENERATION],
            max_tokens=8192,
            cost_per_1k_tokens=0.03,
            created_at=datetime.now(timezone.utc),
        )

        assert model.name == "gpt-4"
        assert model.provider == AIProvider.OPENAI
        assert model.max_tokens == 8192
        assert model.is_available is True

    def test_model_frozen(self):
        """Test that model is frozen (immutable)."""
        model = Model(
            id=uuid4(),
            provider=AIProvider.ANTHROPIC,
            name="claude-3",
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            model.name = "claude-3-opus"


class TestPrompt:
    """Test Prompt domain model."""

    def test_create_prompt(self):
        """Test creating a prompt."""
        prompt = Prompt(
            id=uuid4(),
            name="Summarization Prompt",
            template="Summarize the following text: {{text}}",
            variables=["text"],
            provider=AIProvider.OPENAI,
            model_name="gpt-4",
            created_at=datetime.now(timezone.utc),
        )

        assert prompt.name == "Summarization Prompt"
        assert prompt.template == "Summarize the following text: {{text}}"
        assert prompt.variables == ["text"]

    def test_prompt_frozen(self):
        """Test that prompt is frozen (immutable)."""
        prompt = Prompt(
            id=uuid4(),
            name="Test Prompt",
            template="Hello",
            provider=AIProvider.OPENAI,
            model_name="gpt-4",
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            prompt.name = "Updated Prompt"


class TestAIRequest:
    """Test AIRequest domain model."""

    def test_create_ai_request(self):
        """Test creating an AI request."""
        request = AIRequest(
            id=uuid4(),
            request_type=AIRequestType.CHAT,
            provider=AIProvider.OPENAI,
            model_name="gpt-4",
            prompt="What is the capital of France?",
            created_at=datetime.now(timezone.utc),
        )

        assert request.prompt == "What is the capital of France?"
        assert request.request_type == AIRequestType.CHAT
        assert request.status == AIRequestStatus.PENDING

    def test_ai_request_frozen(self):
        """Test that AI request is frozen (immutable)."""
        request = AIRequest(
            id=uuid4(),
            request_type=AIRequestType.CHAT,
            provider=AIProvider.OPENAI,
            model_name="gpt-4",
            prompt="Hello",
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            request.prompt = "Updated prompt"


class TestAIConversation:
    """Test AIConversation domain model."""

    def test_create_conversation(self):
        """Test creating a conversation."""
        conversation = AIConversation(
            id=uuid4(),
            provider=AIProvider.OPENAI,
            model_name="gpt-4",
            created_at=datetime.now(timezone.utc),
        )

        assert conversation.provider == AIProvider.OPENAI
        assert conversation.model_name == "gpt-4"
        assert conversation.is_active is True

    def test_conversation_frozen(self):
        """Test that conversation is frozen (immutable)."""
        conversation = AIConversation(
            id=uuid4(),
            provider=AIProvider.OPENAI,
            model_name="gpt-4",
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            conversation.title = "New Title"


class TestAIProviderConfig:
    """Test AIProviderConfig domain model."""

    def test_create_provider_config(self):
        """Test creating a provider config."""
        config = AIProviderConfig(
            id=uuid4(),
            provider=AIProvider.OPENAI,
            api_key="sk-test-key",
            default_model="gpt-4",
            rate_limit_rpm=60,
            rate_limit_tpm=90000,
            created_at=datetime.now(timezone.utc),
        )

        assert config.provider == AIProvider.OPENAI
        assert config.api_key == "sk-test-key"
        assert config.rate_limit_rpm == 60
        assert config.is_active is True

    def test_provider_config_frozen(self):
        """Test that provider config is frozen (immutable)."""
        config = AIProviderConfig(
            id=uuid4(),
            provider=AIProvider.OPENAI,
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            config.api_key = "new-key"