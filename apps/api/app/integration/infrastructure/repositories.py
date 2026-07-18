"""Integration Hub repositories."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.integration.infrastructure.models import (
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


class ConnectorRepository:
    """Connector repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        connector = Connector(
            name=name,
            connector_type=connector_type,
            base_url=base_url,
            config=config or {},
            auth_type=auth_type,
            auth_config=auth_config or {},
            headers=headers or {},
            created_by=created_by,
            tenant_id=tenant_id,
        )
        self.session.add(connector)
        await self.session.flush()
        return connector

    async def get_by_id(self, connector_id: UUID) -> Connector | None:
        """Get connector by ID."""
        result = await self.session.execute(
            select(Connector).where(Connector.id == connector_id)
        )
        return result.scalar_one_or_none()

    async def get_active_connectors(
        self,
        connector_type: ConnectorType | None = None,
        tenant_id: UUID | None = None,
    ) -> list[Connector]:
        """Get all active connectors."""
        query = select(Connector).where(Connector.is_active == True)

        if connector_type:
            query = query.where(Connector.connector_type == connector_type)
        if tenant_id:
            query = query.where(Connector.tenant_id == tenant_id)

        result = await self.session.execute(query)
        return list(result.scalars().all())


class IntegrationRepository:
    """Integration repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        integration = Integration(
            name=name,
            connector_id=connector_id,
            source_system=source_system,
            target_system=target_system,
            sync_direction=sync_direction,
            sync_type=sync_type,
            schedule=schedule,
            mapping_config=mapping_config or {},
            transformation_config=transformation_config or {},
            created_by=created_by,
            tenant_id=tenant_id,
        )
        self.session.add(integration)
        await self.session.flush()
        return integration

    async def get_by_id(self, integration_id: UUID) -> Integration | None:
        """Get integration by ID."""
        result = await self.session.execute(
            select(Integration).where(Integration.id == integration_id)
        )
        return result.scalar_one_or_none()

    async def get_active_integrations(
        self,
        tenant_id: UUID | None = None,
    ) -> list[Integration]:
        """Get all active integrations."""
        query = select(Integration).where(Integration.is_active == True)

        if tenant_id:
            query = query.where(Integration.tenant_id == tenant_id)

        result = await self.session.execute(query)
        return list(result.scalars().all())


class IntegrationJobRepository:
    """Integration job repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        integration_id: UUID,
        job_type: str,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
    ) -> IntegrationJob:
        """Create an integration job."""
        job = IntegrationJob(
            integration_id=integration_id,
            job_type=job_type,
            created_by=created_by,
            tenant_id=tenant_id,
        )
        self.session.add(job)
        await self.session.flush()
        return job

    async def update_status(
        self,
        job_id: UUID,
        status: JobStatus,
        records_processed: int | None = None,
        error_message: str | None = None,
        started_at: datetime | None = None,
        completed_at: datetime | None = None,
    ) -> IntegrationJob | None:
        """Update job status."""
        job = await self.get_by_id(job_id)
        if not job:
            return None

        job.status = status
        if records_processed is not None:
            job.records_processed = records_processed
        if error_message is not None:
            job.error_message = error_message
        if started_at is not None:
            job.started_at = started_at
        if completed_at is not None:
            job.completed_at = completed_at

        await self.session.flush()
        return job

    async def get_by_id(self, job_id: UUID) -> IntegrationJob | None:
        """Get job by ID."""
        result = await self.session.execute(
            select(IntegrationJob).where(IntegrationJob.id == job_id)
        )
        return result.scalar_one_or_none()


class WebhookRepository:
    """Webhook repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        webhook = Webhook(
            name=name,
            url=url,
            events=events,
            secret=secret,
            headers=headers or {},
            created_by=created_by,
            tenant_id=tenant_id,
        )
        self.session.add(webhook)
        await self.session.flush()
        return webhook

    async def get_by_id(self, webhook_id: UUID) -> Webhook | None:
        """Get webhook by ID."""
        result = await self.session.execute(
            select(Webhook).where(Webhook.id == webhook_id)
        )
        return result.scalar_one_or_none()

    async def get_active_webhooks(
        self,
        tenant_id: UUID | None = None,
    ) -> list[Webhook]:
        """Get all active webhooks."""
        query = select(Webhook).where(Webhook.is_active == True)

        if tenant_id:
            query = query.where(Webhook.tenant_id == tenant_id)

        result = await self.session.execute(query)
        return list(result.scalars().all())


class WebhookDeliveryRepository:
    """Webhook delivery repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        webhook_id: UUID,
        event: str,
        payload: dict,
    ) -> WebhookDelivery:
        """Create a webhook delivery."""
        delivery = WebhookDelivery(
            webhook_id=webhook_id,
            event=event,
            payload=payload,
        )
        self.session.add(delivery)
        await self.session.flush()
        return delivery

    async def update_delivery(
        self,
        delivery_id: UUID,
        response_status: int | None = None,
        response_body: str | None = None,
        error_message: str | None = None,
        delivered_at: datetime | None = None,
    ) -> WebhookDelivery | None:
        """Update webhook delivery."""
        delivery = await self.get_by_id(delivery_id)
        if not delivery:
            return None

        if response_status is not None:
            delivery.response_status = response_status
        if response_body is not None:
            delivery.response_body = response_body
        if error_message is not None:
            delivery.error_message = error_message
        if delivered_at is not None:
            delivery.delivered_at = delivered_at

        await self.session.flush()
        return delivery

    async def get_by_id(self, delivery_id: UUID) -> WebhookDelivery | None:
        """Get delivery by ID."""
        result = await self.session.execute(
            select(WebhookDelivery).where(WebhookDelivery.id == delivery_id)
        )
        return result.scalar_one_or_none()


class EventBusMessageRepository:
    """Event bus message repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        topic: str,
        event_type: str,
        payload: dict,
        source: str,
        target: str | None = None,
        correlation_id: str | None = None,
        trace_id: str | None = None,
    ) -> EventBusMessage:
        """Create an event bus message."""
        message = EventBusMessage(
            topic=topic,
            event_type=event_type,
            payload=payload,
            source=source,
            target=target,
            correlation_id=correlation_id,
            trace_id=trace_id,
        )
        self.session.add(message)
        await self.session.flush()
        return message

    async def mark_processed(
        self,
        message_id: UUID,
        processed_at: datetime | None = None,
    ) -> EventBusMessage | None:
        """Mark message as processed."""
        message = await self.get_by_id(message_id)
        if not message:
            return None

        message.is_processed = True
        if processed_at:
            message.processed_at = processed_at
        else:
            message.processed_at = datetime.now(datetime.timezone.utc)

        await self.session.flush()
        return message

    async def get_by_id(self, message_id: UUID) -> EventBusMessage | None:
        """Get message by ID."""
        result = await self.session.execute(
            select(EventBusMessage).where(EventBusMessage.id == message_id)
        )
        return result.scalar_one_or_none()

    async def get_pending_messages(
        self,
        topic: str | None = None,
        limit: int = 100,
    ) -> list[EventBusMessage]:
        """Get pending messages."""
        query = select(EventBusMessage).where(EventBusMessage.is_processed == False)

        if topic:
            query = query.where(EventBusMessage.topic == topic)

        query = query.order_by(EventBusMessage.created_at).limit(limit)

        result = await self.session.execute(query)
        return list(result.scalars().all())


class DataMappingRepository:
    """Data mapping repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        mapping = DataMapping(
            name=name,
            source_connector_id=source_connector_id,
            target_connector_id=target_connector_id,
            field_mappings=field_mappings or {},
            validation_rules=validation_rules or {},
            created_by=created_by,
            tenant_id=tenant_id,
        )
        self.session.add(mapping)
        await self.session.flush()
        return mapping

    async def get_by_id(self, mapping_id: UUID) -> DataMapping | None:
        """Get mapping by ID."""
        result = await self.session.execute(
            select(DataMapping).where(DataMapping.id == mapping_id)
        )
        return result.scalar_one_or_none()


class OAuthTokenRepository:
    """OAuth token repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        token = OAuthToken(
            connector_id=connector_id,
            provider=provider,
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=token_type,
            expires_at=expires_at,
            scope=scope,
        )
        self.session.add(token)
        await self.session.flush()
        return token

    async def get_by_connector(
        self,
        connector_id: UUID,
    ) -> OAuthToken | None:
        """Get token by connector ID."""
        result = await self.session.execute(
            select(OAuthToken).where(OAuthToken.connector_id == connector_id)
        )
        return result.scalar_one_or_none()

    async def update_tokens(
        self,
        token_id: UUID,
        access_token: str,
        refresh_token: str | None = None,
        expires_at: datetime | None = None,
    ) -> OAuthToken | None:
        """Update OAuth tokens."""
        token = await self.get_by_id(token_id)
        if not token:
            return None

        token.access_token = access_token
        if refresh_token is not None:
            token.refresh_token = refresh_token
        if expires_at is not None:
            token.expires_at = expires_at

        await self.session.flush()
        return token

    async def get_by_id(self, token_id: UUID) -> OAuthToken | None:
        """Get token by ID."""
        result = await self.session.execute(
            select(OAuthToken).where(OAuthToken.id == token_id)
        )
        return result.scalar_one_or_none()