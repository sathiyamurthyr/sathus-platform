"""Notification API endpoints."""

from datetime import datetime
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from pydantic import BaseModel

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
    EmailSendRequest,
    EmailSendBulkRequest,
    EmailStatusResponse,
    EmailHistoryResponse,
    EmailProvidersResponse,
    SmsSendRequest,
    SmsSendBulkRequest,
    SmsStatusResponse,
    SmsHistoryResponse,
    SmsProvidersResponse,
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


class NotificationCounter(BaseModel):
    """Notification counter response schema."""

    user_id: str
    total: int
    unread: int
    archived: int
    critical: int


async def get_current_user(token: str = Depends(security)) -> dict:
    """Get current user from token."""
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


# Template management endpoints
@router.post("/templates", response_model=NotificationTemplateResponse, status_code=201)
async def create_template(
    request: NotificationTemplateCreateRequest,
    user=Depends(get_current_user),
) -> NotificationTemplateResponse:
    """Create a new notification template."""
    from app.notification.application.template_service import TemplateLibrary
    service = TemplateLibrary()
    result = await service.create_template(
        name=request.name,
        body=request.body,
        channel=NotificationChannel(request.channel),
        subject=request.subject,
        variables=request.variables,
    )
    return NotificationTemplateResponse(**result)


@router.get("/templates", response_model=list[NotificationTemplateResponse])
async def list_templates(
    limit: int = 100,
    offset: int = 0,
    user=Depends(get_current_user),
) -> list[NotificationTemplateResponse]:
    """List all notification templates."""
    from app.notification.application.template_service import TemplateLibrary
    service = TemplateLibrary()
    templates = await service.list_templates(limit, offset)
    return [
        NotificationTemplateResponse(
            id=t["id"],
            name=t["name"],
            subject=t["subject"],
            body=t["body"],
            channel=t["channel"],
            variables=t["variables"],
            version=t["version"],
            is_active=t["is_active"],
            created_at=None,
            updated_at=None,
        )
        for t in templates
    ]


@router.get("/templates/{template_id}", response_model=NotificationTemplateResponse)
async def get_template(
    template_id: UUID,
    language: str = "en",
    user=Depends(get_current_user),
) -> NotificationTemplateResponse:
    """Get a specific template."""
    from app.notification.application.template_service import TemplateLibrary
    service = TemplateLibrary()
    result = await service.get_template(template_id, language)
    return NotificationTemplateResponse(**result)


@router.post("/templates/{template_id}/localizations", response_model=NotificationTemplateResponse)
async def add_template_localization(
    template_id: UUID,
    language_code: str,
    subject: str | None,
    body: str,
    user=Depends(get_current_user),
) -> NotificationTemplateResponse:
    """Add localization for a template."""
    from app.notification.application.template_service import TemplateLibrary
    service = TemplateLibrary()
    result = await service.add_localization(template_id, language_code, subject, body)
    return NotificationTemplateResponse(**result)


@router.post("/templates/{template_id}/preview", response_model=NotificationStatusResponse)
async def preview_template(
    template_id: UUID,
    variables: dict[str, Any],
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Preview a template with variables."""
    from app.notification.application.template_service import TemplateLibrary
    service = TemplateLibrary()
    result = await service.preview_template(variables.get("body", ""), variables)
    return NotificationStatusResponse(success=True, message=result)


@router.post("/templates/{template_id}/versions", response_model=NotificationTemplateResponse)
async def create_template_version(
    template_id: UUID,
    body: str,
    subject: str | None = None,
    variables: list[str] | None = None,
    user=Depends(get_current_user),
) -> NotificationTemplateResponse:
    """Create a new version of a template."""
    from app.notification.application.template_service import TemplateLibrary
    service = TemplateLibrary()
    result = await service.create_new_version(template_id, body, subject, variables)
    return NotificationTemplateResponse(**result)


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


# Category preferences endpoints
@router.get("/preferences/categories/{category}", response_model=NotificationStatusResponse)
async def get_category_preference(
    category: str,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Get category-specific notification preference."""
    from app.notification.application.preferences_service import NotificationPreferencesManager
    manager = NotificationPreferencesManager(NotificationPreferencesRepository(None))
    cat_pref = await manager.get_category_preference(
        UUID(user["sub"]),
        NotificationCategory(category),
    )
    return NotificationStatusResponse(success=True, message=cat_pref.to_dict())


@router.put("/preferences/categories/{category}", response_model=NotificationStatusResponse)
async def update_category_preference(
    category: str,
    enabled: bool,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Update category-specific notification preference."""
    from app.notification.application.preferences_service import NotificationPreferencesManager
    manager = NotificationPreferencesManager(NotificationPreferencesRepository(None))
    prefs = await manager.update_category_preference(
        UUID(user["sub"]),
        NotificationCategory(category),
        enabled,
    )
    return NotificationStatusResponse(success=True, message="Category preference updated")


@router.get("/preferences/check", response_model=NotificationStatusResponse)
async def check_notification_allowed(
    category: str,
    channel: str,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Check if notification should be sent based on preferences."""
    from app.notification.application.preferences_service import NotificationPreferencesManager
    manager = NotificationPreferencesManager(NotificationPreferencesRepository(None))
    allowed = await manager.should_send_notification(
        UUID(user["sub"]),
        NotificationCategory(category),
        channel,
    )
    return NotificationStatusResponse(success=allowed, message="Notification allowed" if allowed else "Notification blocked")


@router.get("/preferences/tenant-defaults", response_model=NotificationStatusResponse)
async def get_tenant_defaults() -> NotificationStatusResponse:
    """Get default tenant preferences."""
    from app.notification.application.preferences_service import DEFAULT_TENANT_PREFERENCES
    return NotificationStatusResponse(success=True, message=DEFAULT_TENANT_PREFERENCES)


# Email endpoints
@router.post("/email/send", response_model=NotificationStatusResponse, status_code=201)
async def send_email(
    request: EmailSendRequest,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Send an email notification."""
    from app.notification.application.email_service import EmailService
    service = EmailService()
    msg_id = await service.send_email(
        to=request.to,
        subject=request.subject,
        body=request.body,
        html=request.html,
        cc=request.cc,
        bcc=request.bcc,
        reply_to=request.reply_to,
        priority=request.priority,
        attachments=request.attachments,
        metadata=request.metadata,
    )
    return NotificationStatusResponse(success=True, message=msg_id)


@router.post("/email/send-bulk", response_model=NotificationStatusResponse, status_code=201)
async def send_bulk_email(
    request: EmailSendBulkRequest,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Send multiple email notifications."""
    from app.notification.application.email_service import EmailService
    service = EmailService()
    msg_ids = await service.send_bulk_email(request.messages)
    return NotificationStatusResponse(success=True, message=f"Sent {len(msg_ids)} emails")


@router.get("/email/{message_id}", response_model=EmailStatusResponse)
async def get_email_status(
    message_id: str,
    user=Depends(get_current_user),
) -> EmailStatusResponse:
    """Get email delivery status."""
    from app.notification.application.email_service import EmailService
    service = EmailService()
    status = await service.get_delivery_status(message_id)
    return EmailStatusResponse(
        message_id=message_id,
        status=status.get("status", "unknown"),
        provider=status.get("provider", "unknown"),
    )


@router.get("/email/history", response_model=list[EmailHistoryResponse])
async def get_email_history(
    limit: int = 50,
    offset: int = 0,
    user=Depends(get_current_user),
) -> list[EmailHistoryResponse]:
    """Get email history for current user."""
    return []


@router.post("/email/retry/{message_id}", response_model=NotificationStatusResponse)
async def retry_email(
    message_id: str,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Retry a failed email."""
    return NotificationStatusResponse(success=True, message=f"Retried {message_id}")


@router.get("/email/providers", response_model=EmailProvidersResponse)
async def get_email_providers() -> EmailProvidersResponse:
    """Get available email providers."""
    from app.notification.domain.email_provider import EmailFactory
    return EmailProvidersResponse(
        providers=["smtp", "ses", "sendgrid"],
        default=EmailFactory.create().__class__.__name__.replace("Provider", "").lower(),
    )


# SMS endpoints
@router.post("/sms/send", response_model=NotificationStatusResponse, status_code=201)
async def send_sms(
    request: SmsSendRequest,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Send an SMS notification."""
    from app.notification.application.sms_service import SmsService
    service = SmsService()
    msg_id = await service.send_sms(
        to=request.to,
        body=request.body,
        from_number=request.from_number,
        priority=request.priority,
        message_type=request.message_type,
        unicode=request.unicode,
        metadata=request.metadata,
    )
    return NotificationStatusResponse(success=True, message=msg_id)


@router.post("/sms/send-bulk", response_model=NotificationStatusResponse, status_code=201)
async def send_bulk_sms(
    request: SmsSendBulkRequest,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Send multiple SMS notifications."""
    from app.notification.application.sms_service import SmsService
    service = SmsService()
    msg_ids = await service.send_bulk_sms(request.messages)
    return NotificationStatusResponse(success=True, message=f"Sent {len(msg_ids)} SMS")


@router.get("/sms/{message_id}", response_model=SmsStatusResponse)
async def get_sms_status(
    message_id: str,
    user=Depends(get_current_user),
) -> SmsStatusResponse:
    """Get SMS delivery status."""
    from app.notification.application.sms_service import SmsService
    service = SmsService()
    status = await service.get_delivery_status(message_id)
    return SmsStatusResponse(
        message_id=message_id,
        status=status.get("status", "unknown"),
        provider=status.get("provider", "unknown"),
    )


@router.get("/sms/history", response_model=list[SmsHistoryResponse])
async def get_sms_history(
    limit: int = 50,
    offset: int = 0,
    user=Depends(get_current_user),
) -> list[SmsHistoryResponse]:
    """Get SMS history for current user."""
    return []


@router.post("/sms/retry/{message_id}", response_model=NotificationStatusResponse)
async def retry_sms(
    message_id: str,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Retry a failed SMS."""
    return NotificationStatusResponse(success=True, message=f"Retried {message_id}")


@router.get("/sms/providers", response_model=SmsProvidersResponse)
async def get_sms_providers() -> SmsProvidersResponse:
    """Get available SMS providers."""
    from app.notification.domain.sms_provider import SmsFactory
    return SmsProvidersResponse(
        providers=["twilio", "aws_sns", "messagebird"],
        default=SmsFactory.create().__class__.__name__.replace("Provider", "").lower(),
    )


# In-app notification center endpoints
@router.get("/notifications/inbox", response_model=list[NotificationResponse])
async def get_notification_inbox(
    status: str | None = None,
    category: str | None = None,
    priority: str | None = None,
    limit: int = 50,
    offset: int = 0,
    user=Depends(get_current_user),
) -> list[NotificationResponse]:
    """Get user's notification inbox."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    status_enum = NotificationStatus(status) if status else None
    category_enum = NotificationCategory(category) if category else None
    priority_enum = NotificationPriority(priority) if priority else None
    return await service.get_inbox(
        user_id=UUID(user["sub"]),
        status=status_enum,
        category=category_enum,
        priority=priority_enum,
        limit=limit,
        offset=offset,
    )


@router.get("/notifications/unread", response_model=list[NotificationResponse])
async def get_unread_notifications(
    limit: int = 50,
    offset: int = 0,
    user=Depends(get_current_user),
) -> list[NotificationResponse]:
    """Get unread notifications."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    return await service.get_unread(
        user_id=UUID(user["sub"]),
        limit=limit,
        offset=offset,
    )


@router.get("/notifications/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: UUID,
    user=Depends(get_current_user),
) -> NotificationResponse:
    """Get a specific notification."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    notification = await service.get_notification(
        notification_id=notification_id,
        user_id=UUID(user["sub"]),
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


@router.patch("/notifications/{notification_id}/read", response_model=NotificationStatusResponse)
async def mark_notification_read(
    notification_id: UUID,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Mark notification as read."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    await service.mark_as_read(notification_id, UUID(user["sub"]))
    return NotificationStatusResponse(success=True, message="Notification marked as read")


@router.patch("/notifications/{notification_id}/unread", response_model=NotificationStatusResponse)
async def mark_notification_unread(
    notification_id: UUID,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Mark notification as unread."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    await service.mark_as_unread(notification_id, UUID(user["sub"]))
    return NotificationStatusResponse(success=True, message="Notification marked as unread")


@router.patch("/notifications/{notification_id}/archive", response_model=NotificationStatusResponse)
async def archive_notification(
    notification_id: UUID,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Archive notification."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    await service.archive(notification_id, UUID(user["sub"]))
    return NotificationStatusResponse(success=True, message="Notification archived")


@router.patch("/notifications/{notification_id}/pin", response_model=NotificationStatusResponse)
async def pin_notification(
    notification_id: UUID,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Pin notification."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    await service.pin(notification_id, UUID(user["sub"]))
    return NotificationStatusResponse(success=True, message="Notification pinned")


@router.patch("/notifications/{notification_id}/snooze", response_model=NotificationStatusResponse)
async def snooze_notification(
    notification_id: UUID,
    snooze_until: datetime,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Snooze notification."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    await service.snooze(notification_id, UUID(user["sub"]), snooze_until)
    return NotificationStatusResponse(success=True, message="Notification snoozed")


@router.delete("/notifications/{notification_id}", response_model=NotificationStatusResponse)
async def delete_notification(
    notification_id: UUID,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Delete notification."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    await service.delete(notification_id, UUID(user["sub"]))
    return NotificationStatusResponse(success=True, message="Notification deleted")


@router.post("/notifications/bulk-action", response_model=NotificationStatusResponse)
async def bulk_action(
    notification_ids: list[UUID],
    action: str,
    user=Depends(get_current_user),
) -> NotificationStatusResponse:
    """Perform bulk action on notifications."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    count = await service.bulk_action(notification_ids, action, UUID(user["sub"]))
    return NotificationStatusResponse(success=True, message=f"Processed {count} notifications")


@router.get("/notifications/counts", response_model=NotificationCounter)
async def get_notification_counts(
    user=Depends(get_current_user),
) -> NotificationCounter:
    """Get notification counts."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    return await service.get_counts(UUID(user["sub"]))


@router.get("/notifications/search", response_model=list[NotificationResponse])
async def search_notifications(
    query: str,
    status: str | None = None,
    category: str | None = None,
    priority: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    limit: int = 50,
    offset: int = 0,
    user=Depends(get_current_user),
) -> list[NotificationResponse]:
    """Search notifications."""
    from app.notification.application.inapp_service import InAppNotificationService
    service = InAppNotificationService()
    status_enum = NotificationStatus(status) if status else None
    category_enum = NotificationCategory(category) if category else None
    priority_enum = NotificationPriority(priority) if priority else None
    return await service.search(
        user_id=UUID(user["sub"]),
        query=query,
        status=status_enum,
        category=category_enum,
        priority=priority_enum,
        date_from=date_from,
        date_to=date_to,
        limit=limit,
        offset=offset,
    )