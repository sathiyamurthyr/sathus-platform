"""Integration Hub application services."""

from datetime import datetime
from uuid import UUID

from app.integration.domain.models import (
    Connector,
    Integration,
    IntegrationJob,
    Webhook,
    WebhookDelivery,
    EventBusMessage,
    DataMapping,
    OAuthToken,
    ConnectorType,
    IntegrationStatus,
    SyncDirection,
    SyncType,
    JobStatus,
    AuthType,
)
from app.integration.infrastructure.models import (
    Connector as ConnectorModel,
    Integration as IntegrationModel,
    IntegrationJob as IntegrationJobModel,
    Webhook as WebhookModel,
    WebhookDelivery as WebhookDeliveryModel,
    EventBusMessage as EventBusMessageModel,
    DataMapping as DataMappingModel,
    OAuthToken as OAuthTokenModel,
    ConnectorType as ConnectorTypeModel,
    IntegrationStatus as IntegrationStatusModel,
    SyncDirection as SyncDirectionModel,
    SyncType as SyncTypeModel,
    JobStatus as JobStatusModel,
    AuthType as AuthTypeModel,
)
from app.integration.infrastructure.repositories import (
    ConnectorRepository,
    IntegrationRepository,
    IntegrationJobRepository,
    WebhookRepository,
    WebhookDeliveryRepository,
    EventBusMessageRepository,
    DataMappingRepository,
    OAuthTokenRepository,
)
from app.core.logging import logger


class ConnectorService:
    """Connector service."""

    def __init__(self, connector_repo: ConnectorRepository):
        """Initialize service."""
        self.connector_repo = connector_repo

    async def create_connector(
        self,
        name: str,
        connector_type: ConnectorType,
        base_url: str | None = None,
        config: dict | None = None,
        auth_type: AuthType | None = None,
        auth_config: dict | None = None,
        headers: dict | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> Connector:
        """Create a connector."""
        connector = await self.connector_repo.create(
            name=name,
            connector_type=ConnectorTypeModel(connector_type.value),
            base_url=base_url,
            config=config,
            auth_type=AuthTypeModel(auth_type.value) if auth_type else None,
            auth_config=auth_config,
            headers=headers,
            created_by=created_by,
            tenant_id=tenant_id,
        )

        logger.info(f"Connector created: {connector.id}")

        return Connector(
            id=connector.id,
            name=connector.name,
            description=connector.description,
            connector_type=connector_type,
            base_url=connector.base_url,
            config=connector.config,
            auth_type=auth_type,
            auth_config=connector.auth_config,
            headers=connector.headers,
            is_active=connector.is_active,
            status=IntegrationStatus(connector.status.value),
            created_by=connector.created_by,
            tenant_id=connector.tenant_id,
            created_at=connector.created_at,
            updated_at=connector.updated_at,
        )


class IntegrationService:
    """Integration service."""

    def __init__(self, integration_repo: IntegrationRepository):
        """Initialize service."""
        self.integration_repo = integration_repo

    async def create_integration(
        self,
        name: str,
        connector_id: UUID,
        source_system: str,
        target_system: str,
        sync_direction: SyncDirection,
        sync_type: SyncType,
        schedule: str | None = None,
        mapping_config: dict | None = None,
        transformation_config: dict | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> Integration:
        """Create an integration."""
        integration = await self.integration_repo.create(
            name=name,
            connector_id=connector_id,
            source_system=source_system,
            target_system=target_system,
            sync_direction=SyncDirectionModel(sync_direction.value),
            sync_type=SyncTypeModel(sync_type.value),
            schedule=schedule,
            mapping_config=mapping_config,
            transformation_config=transformation_config,
            created_by=created_by,
            tenant_id=tenant_id,
        )

        logger.info(f"Integration created: {integration.id}")

        return Integration(
            id=integration.id,
            name=integration.name,
            description=integration.description,
            connector_id=integration.connector_id,
            source_system=integration.source_system,
            target_system=integration.target_system,
            sync_direction=sync_direction,
            sync_type=sync_type,
            schedule=integration.schedule,
            mapping_config=integration.mapping_config,
            transformation_config=integration.transformation_config,
            is_active=integration.is_active,
            status=IntegrationStatus(integration.status.value),
            last_sync_at=integration.last_sync_at,
            next_sync_at=integration.next_sync_at,
            created_by=integration.created_by,
            tenant_id=integration.tenant_id,
            created_at=integration.created_at,
            updated_at=integration.updated_at,
        )


class IntegrationJobService:
    """Integration job service."""

    def __init__(self, job_repo: IntegrationJobRepository):
        """Initialize service."""
        self.job_repo = job_repo

    async def create_job(
        self,
        integration_id: UUID,
        job_type: str,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> IntegrationJob:
        """Create an integration job."""
        job = await self.job_repo.create(
            integration_id=integration_id,
            job_type=job_type,
            created_by=created_by,
            tenant_id=tenant_id,
        )

        logger.info(f"Integration job created: {job.id}")

        return IntegrationJob(
            id=job.id,
            integration_id=job.integration_id,
            job_type=job.job_type,
            status=JobStatus(job.status.value),
            records_processed=job.records_processed,
            records_total=job.records_total,
            error_message=job.error_message,
            started_at=job.started_at,
            completed_at=job.completed_at,
            created_by=job.created_by,
            tenant_id=job.tenant_id,
            created_at=job.created_at,
        )


class WebhookService:
    """Webhook service."""

    def __init__(self, webhook_repo: WebhookRepository):
        """Initialize service."""
        self.webhook_repo = webhook_repo

    async def create_webhook(
        self,
        name: str,
        url: str,
        events: list[str],
        secret: str | None = None,
        headers: dict | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> Webhook:
        """Create a webhook."""
        webhook = await self.webhook_repo.create(
            name=name,
            url=url,
            events=events,
            secret=secret,
            headers=headers,
            created_by=created_by,
            tenant_id=tenant_id,
        )

        logger.info(f"Webhook created: {webhook.id}")

        return Webhook(
            id=webhook.id,
            name=webhook.name,
            url=webhook.url,
            events=webhook.events,
            secret=webhook.secret,
            headers=webhook.headers,
            is_active=webhook.is_active,
            retry_count=webhook.retry_count,
            max_retries=webhook.max_retries,
            created_by=webhook.created_by,
            tenant_id=webhook.tenant_id,
            created_at=webhook.created_at,
            updated_at=webhook.updated_at,
        )


class EventBusService:
    """Event bus service."""

    def __init__(self, message_repo: EventBusMessageRepository):
        """Initialize service."""
        self.message_repo = message_repo

    async def publish_message(
        self,
        topic: str,
        event_type: str,
        payload: dict,
        source: str,
        target: str | None = None,
        correlation_id: str | None = None,
        trace_id: str | None = None,
    ) -> EventBusMessage:
        """Publish a message to the event bus."""
        message = await self.message_repo.create(
            topic=topic,
            event_type=event_type,
            payload=payload,
            source=source,
            target=target,
            correlation_id=correlation_id,
            trace_id=trace_id,
        )

        logger.info(f"Event bus message published: {message.id}")

        return EventBusMessage(
            id=message.id,
            topic=message.topic,
            event_type=message.event_type,
            payload=message.payload,
            source=message.source,
            target=message.target,
            correlation_id=message.correlation_id,
            trace_id=message.trace_id,
            is_processed=message.is_processed,
            processed_at=message.processed_at,
            created_at=message.created_at,
        )


class DataMappingService:
    """Data mapping service."""

    def __init__(self, mapping_repo: DataMappingRepository):
        """Initialize service."""
        self.mapping_repo = mapping_repo

    async def create_mapping(
        self,
        name: str,
        source_connector_id: UUID,
        target_connector_id: UUID,
        field_mappings: dict | None = None,
        validation_rules: dict | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> DataMapping:
        """Create a data mapping."""
        mapping = await self.mapping_repo.create(
            name=name,
            source_connector_id=source_connector_id,
            target_connector_id=target_connector_id,
            field_mappings=field_mappings,
            validation_rules=validation_rules,
            created_by=created_by,
            tenant_id=tenant_id,
        )

        logger.info(f"Data mapping created: {mapping.id}")

        return DataMapping(
            id=mapping.id,
            name=mapping.name,
            source_connector_id=mapping.source_connector_id,
            target_connector_id=mapping.target_connector_id,
            field_mappings=mapping.field_mappings,
            validation_rules=mapping.validation_rules,
            is_active=mapping.is_active,
            created_by=mapping.created_by,
            tenant_id=mapping.tenant_id,
            created_at=mapping.created_at,
            updated_at=mapping.updated_at,
        )


class OAuthTokenService:
    """OAuth token service."""

    def __init__(self, token_repo: OAuthTokenRepository):
        """Initialize service."""
        self.token_repo = token_repo

    async def create_token(
        self,
        connector_id: UUID,
        provider: str,
        access_token: str,
        refresh_token: str | None = None,
        token_type: str = "Bearer",
        expires_at: datetime | None = None,
        scope: str | None = None,
    ) -> OAuthToken:
        """Create an OAuth token."""
        token = await self.token_repo.create(
            connector_id=connector_id,
            provider=provider,
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=token_type,
            expires_at=expires_at,
            scope=scope,
        )

        logger.info(f"OAuth token created: {token.id}")

        return OAuthToken(
            id=token.id,
            connector_id=token.connector_id,
            provider=token.provider,
            access_token=token.access_token,
            refresh_token=token.refresh_token,
            token_type=token.token_type,
            expires_at=token.expires_at,
            scope=token.scope,
            created_at=token.created_at,
            updated_at=token.updated_at,
        )