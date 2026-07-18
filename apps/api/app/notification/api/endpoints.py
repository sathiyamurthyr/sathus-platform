"""Notification API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer

from app.core.database import get_db
from app.notification.api.schemas import (
    NotificationCreateRequest,
    NotificationResponse,
    NotificationTemplateCreateRequest,
    NotificationTemplateResponse,
    NotificationPreferencesUpdateRequest,
    NotificationPreferencesResponse,
    UnreadCountResponse,
    NotificationStatusResponse,
)
from app.notification.application.services import (
    NotificationService,
    NotificationTemplateService,
    NotificationPreferencesService,
)
from app.notification.infrastructure.models import (
    NotificationChannel,
    NotificationCategory,
    NotificationPriority,
    NotificationStatus,
)
from app.notification.infrastructure.repositories import (
    NotificationRepository,
    NotificationTemplateRepository,
    NotificationPreferencesRepository,
)

router = APIRouter()
security = HTTPBearer()


async def get_current_user(token: str = Depends(security)) -> dict:
    """Get current user from token."""
    # This will be replaced with actual auth when integrated
    # For now, return a mock user for testing
    return {"sub": "test-user-id"}


def get_notification_service(db=Depends(get_db)) -> NotificationService:
    """Get notification service."""
    return NotificationService(
        notification_repo=NotificationRepository(db),
        template_repo=NotificationTemplateRepository(db),
        preferences_repo=NotificationPreferencesRepository(db),
    )


def get_template_service(db=Depends(get_db)) -> NotificationTemplateService:
    """Get template service."""
    return NotificationTemplateService(
        template_repo=NotificationTemplateRepository(db),
    )


def get_preferences_service(db=Depends(get_db)) -> NotificationPreferencesService:
    """Get preferences service."""
    return NotificationPreferencesService(
        preferences_repo=NotificationPreferencesRepository(db),
    )


@router.post("/", response_model=NotificationResponse, status_code=201)
async def create_notification(
    request: NotificationCreateRequest,
    user=Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
) -> NotificationResponse:
    """Create a new notification."""
    try:
        channel = NotificationChannel(request.channel)
        category = NotificationCategory(request.category)
        priority = NotificationPriority(request.priority)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    notification = await service.create_notification(
        user_id=UUID(user["sub"]),
        category=category,
        channel=channel,
        body=request.body,
        subject=request.subject,
        template_id=request.template_id,
        priority=priority,
        destination=request.destination,
        scheduled_at=request.scheduled_at,
        metadata=request.metadata,
    )

    return NotificationResponse(
        id=notification.id,
        category=notification.category.value,
        channel=notification.channel.value,
        subject=notification.subject,
        body=notification.body,
        status=notification.status.value,
        priority=notification.priority.value,
        scheduled_at=notification.scheduled_at,
        sent_at=notification.sent_at,
        delivered_at=notification.delivered_at,
        opened_at=notification.opened_at,
        failure_reason=notification.failure_reason,
        created_at=notification.created_at,
        updated_at=notification.updated_at,
    )


@router.get("/", response_model=list[NotificationResponse])
async def list_notifications(
    status: str | None = None,
    limit: int = 50,
    offset: int = 0,
    user=Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
) -> list[NotificationResponse]:
    """List notifications for current user."""
    status_enum = None
    if status:
        try:
            status_enum = NotificationStatus(status)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid status")

    notifications = await service.get_user_notifications(
        user_id=UUID(user["sub"]),
        status=status_enum,
        limit=limit,
        offset=offset,
    )

    return [
        NotificationResponse(
            id=n.id,
            category=n.category.value,
            channel=n.channel.value,
            subject=n.subject,
            body=n.body,
            status=n.status.value,
            priority=n.priority.value,
            scheduled_at=n.scheduled_at,
            sent_at=n.sent_at,
            delivered_at=n.delivered_at,
            opened_at=n.opened_at,
            failure_reason=n.failure_reason,
            created_at=n.created_at,
            updated_at=n.updated_at,
        )
        for n in notifications
    ]


@router.get("/unread-count", response_model=UnreadCountResponse)
async def get_unread_count(
    user=Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
) -> UnreadCountResponse:
    """Get unread notification count."""
    count = await service.get_unread_count(UUID(user["sub"]))
    return UnreadCountResponse(count=count)


@router.post("/{notification_id}/read", response_model=NotificationStatusResponse)
async def mark_as_read(
    notification_id: UUID,
    user=Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
) -> NotificationStatusResponse:
    """Mark a notification as read."""
    success = await service.mark_as_read(notification_id, UUID(user["sub"]))
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return NotificationStatusResponse(success=True, message="Notification marked as read")


@router.post("/{notification_id}/cancel", response_model=NotificationStatusResponse)
async def cancel_notification(
    notification_id: UUID,
    user=Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
) -> NotificationStatusResponse:
    """Cancel a pending notification."""
    success = await service.cancel_notification(notification_id, UUID(user["sub"]))
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found or cannot be cancelled")
    return NotificationStatusResponse(success=True, message="Notification cancelled")


# Template endpoints
@router.post("/templates", response_model=NotificationTemplateResponse, status_code=201)
async def create_template(
    request: NotificationTemplateCreateRequest,
    service: NotificationTemplateService = Depends(get_template_service),
) -> NotificationTemplateResponse:
    """Create a new notification template."""
    try:
        channel = NotificationChannel(request.channel)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid channel")

    template = await service.create_template(
        name=request.name,
        body=request.body,
        channel=channel,
        subject=request.subject,
        variables=request.variables,
    )

    return NotificationTemplateResponse(
        id=template.id,
        name=template.name,
        subject=template.subject,
        body=template.body,
        channel=template.channel.value,
        variables=template.variables,
        version=template.version,
        is_active=template.is_active,
        created_at=template.created_at,
        updated_at=template.updated_at,
    )


@router.get("/templates", response_model=list[NotificationTemplateResponse])
async def list_templates(
    limit: int = 100,
    offset: int = 0,
    service: NotificationTemplateService = Depends(get_template_service),
) -> list[NotificationTemplateResponse]:
    """List all notification templates."""
    templates = await service.list_templates(limit, offset)
    return [
        NotificationTemplateResponse(
            id=t.id,
            name=t.name,
            subject=t.subject,
            body=t.body,
            channel=t.channel.value,
            variables=t.variables,
            version=t.version,
            is_active=t.is_active,
            created_at=t.created_at,
            updated_at=t.updated_at,
        )
        for t in templates
    ]


# Preferences endpoints
@router.get("/preferences", response_model=NotificationPreferencesResponse)
async def get_preferences(
    user=Depends(get_current_user),
    service: NotificationPreferencesService = Depends(get_preferences_service),
) -> NotificationPreferencesResponse:
    """Get notification preferences for current user."""
    prefs = await service.get_preferences(UUID(user["sub"]))
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return NotificationPreferencesResponse(
        user_id=prefs.user_id,
        email_enabled=prefs.email_enabled,
        sms_enabled=prefs.sms_enabled,
        push_enabled=prefs.push_enabled,
        in_app_enabled=prefs.in_app_enabled,
        quiet_hours_start=prefs.quiet_hours_start,
        quiet_hours_end=prefs.quiet_hours_end,
        timezone=prefs.timezone,
        language=prefs.language,
        frequency=prefs.frequency,
    )


@router.put("/preferences", response_model=NotificationPreferencesResponse)
async def update_preferences(
    request: NotificationPreferencesUpdateRequest,
    user=Depends(get_current_user),
    service: NotificationPreferencesService = Depends(get_preferences_service),
) -> NotificationPreferencesResponse:
    """Update notification preferences for current user."""
    prefs = await service.update_preferences(
        user_id=UUID(user["sub"]),
        email_enabled=request.email_enabled,
        sms_enabled=request.sms_enabled,
        push_enabled=request.push_enabled,
        in_app_enabled=request.in_app_enabled,
        quiet_hours_start=request.quiet_hours_start,
        quiet_hours_end=request.quiet_hours_end,
        timezone=request.timezone,
        language=request.language,
        frequency=request.frequency,
    )
    return NotificationPreferencesResponse(
        user_id=prefs.user_id,
        email_enabled=prefs.email_enabled,
        sms_enabled=prefs.sms_enabled,
        push_enabled=prefs.push_enabled,
        in_app_enabled=prefs.in_app_enabled,
        quiet_hours_start=prefs.quiet_hours_start,
        quiet_hours_end=prefs.quiet_hours_end,
        timezone=prefs.timezone,
        language=prefs.language,
        frequency=prefs.frequency,
    )