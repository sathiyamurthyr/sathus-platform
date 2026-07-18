"""Integration Hub API endpoints."""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.integration.api.schemas import (
    ConnectorResponse,
    ConnectorCreate,
    IntegrationResponse,
    IntegrationCreate,
    WebhookResponse,
    WebhookCreate,
    EventBusMessageResponse,
    EventBusMessageCreate,
)
from app.integration.application.services import (
    ConnectorService,
    IntegrationService,
    WebhookService,
    EventBusService,
)
from app.integration.infrastructure.repositories import (
    ConnectorRepository,
    IntegrationRepository,
    WebhookRepository,
    EventBusMessageRepository,
)
from app.core.database import get_db

router = APIRouter()


async def get_connector_service(
    session: AsyncSession = Depends(get_db),
) -> ConnectorService:
    """Get connector service."""
    return ConnectorService(ConnectorRepository(session))


@router.post("/connectors", response_model=ConnectorResponse, status_code=status.HTTP_201_CREATED)
async def create_connector(
    connector: ConnectorCreate,
    service: ConnectorService = Depends(get_connector_service),
) -> ConnectorResponse:
    """Create a connector."""
    created = await service.create_connector(
        name=connector.name,
        connector_type=connector.connector_type,
        base_url=connector.base_url,
        config=connector.config,
        auth_type=connector.auth_type,
        auth_config=connector.auth_config,
        headers=connector.headers,
    )
    return ConnectorResponse(
        id=created.id,
        name=created.name,
        description=created.description,
        connector_type=created.connector_type.value,
        base_url=created.base_url,
        is_active=created.is_active,
        status=created.status.value,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


async def get_integration_service(
    session: AsyncSession = Depends(get_db),
) -> IntegrationService:
    """Get integration service."""
    return IntegrationService(IntegrationRepository(session))


@router.post("/integrations", response_model=IntegrationResponse, status_code=status.HTTP_201_CREATED)
async def create_integration(
    integration: IntegrationCreate,
    service: IntegrationService = Depends(get_integration_service),
) -> IntegrationResponse:
    """Create an integration."""
    created = await service.create_integration(
        name=integration.name,
        connector_id=integration.connector_id,
        source_system=integration.source_system,
        target_system=integration.target_system,
        sync_direction=integration.sync_direction,
        sync_type=integration.sync_type,
        schedule=integration.schedule,
        mapping_config=integration.mapping_config,
        transformation_config=integration.transformation_config,
    )
    return IntegrationResponse(
        id=created.id,
        name=created.name,
        description=created.description,
        connector_id=created.connector_id,
        source_system=created.source_system,
        target_system=created.target_system,
        sync_direction=created.sync_direction.value,
        sync_type=created.sync_type.value,
        is_active=created.is_active,
        status=created.status.value,
        last_sync_at=created.last_sync_at,
        next_sync_at=created.next_sync_at,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


async def get_webhook_service(
    session: AsyncSession = Depends(get_db),
) -> WebhookService:
    """Get webhook service."""
    return WebhookService(WebhookRepository(session))


@router.post("/webhooks", response_model=WebhookResponse, status_code=status.HTTP_201_CREATED)
async def create_webhook(
    webhook: WebhookCreate,
    service: WebhookService = Depends(get_webhook_service),
) -> WebhookResponse:
    """Create a webhook."""
    created = await service.create_webhook(
        name=webhook.name,
        url=webhook.url,
        events=webhook.events,
        secret=webhook.secret,
        headers=webhook.headers,
    )
    return WebhookResponse(
        id=created.id,
        name=created.name,
        url=created.url,
        events=created.events,
        is_active=created.is_active,
        retry_count=created.retry_count,
        max_retries=created.max_retries,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


async def get_event_bus_service(
    session: AsyncSession = Depends(get_db),
) -> EventBusService:
    """Get event bus service."""
    return EventBusService(EventBusMessageRepository(session))


@router.post("/events", response_model=EventBusMessageResponse, status_code=status.HTTP_201_CREATED)
async def publish_event(
    event: EventBusMessageCreate,
    service: EventBusService = Depends(get_event_bus_service),
) -> EventBusMessageResponse:
    """Publish an event to the event bus."""
    created = await service.publish_message(
        topic=event.topic,
        event_type=event.event_type,
        payload=event.payload,
        source=event.source,
        target=event.target,
        correlation_id=event.correlation_id,
        trace_id=event.trace_id,
    )
    return EventBusMessageResponse(
        id=created.id,
        topic=created.topic,
        event_type=created.event_type,
        source=created.source,
        target=created.target,
        correlation_id=created.correlation_id,
        trace_id=created.trace_id,
        is_processed=created.is_processed,
        created_at=created.created_at,
    )