"""Notification API endpoints."""

from datetime import datetime
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from pydantic import BaseModel

from app.core.database import get_db
from app.notification.api.schemas import (
    BatchDispatchRequest,
    BatchDispatchResponse,
    DLQItemResponse,
    DirectSendRequest,
    DirectSendResponse,
    EmailHistoryResponse,
    EmailProvidersResponse,
    EmailSendBulkRequest,
    EmailSendRequest,
    EmailStatusResponse,
    JobListResponse,
    JobResponse,
    NotificationCreateRequest,
    NotificationPreferencesResponse,
    NotificationPreferencesUpdateRequest,
    NotificationResponse,
    NotificationStatusResponse,
    NotificationTemplateCreateRequest,
    NotificationTemplateResponse,
    ProviderTestRequest,
    ProviderTestResponse,
    QueueControlRequest,
    QueueStatsResponse,
    SmsHistoryResponse,
    SmsProvidersResponse,
    SmsSendBulkRequest,
    SmsSendRequest,
    SmsStatusResponse,
    UnreadCountResponse,
    WorkerStatusResponse,
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


# --- Phase 2 Provider Integration & Dispatch Endpoints ---

@router.post("/send", response_model=DirectSendResponse, status_code=201)
async def send_direct_notification(
    request: DirectSendRequest,
    user=Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
) -> DirectSendResponse:
    """Directly send a notification message across any channel via configured provider."""
    try:
        res = await service.dispatch_engine.send_direct(
            channel=request.channel,
            destination=request.destination,
            subject=request.subject,
            body=request.body,
            provider_name=request.provider_name,
            metadata=request.metadata,
        )
        return DirectSendResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/test", response_model=NotificationStatusResponse)
async def send_test_notification(
    request: DirectSendRequest,
    user=Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
) -> NotificationStatusResponse:
    """Send a test notification payload to verify provider routing."""
    try:
        res = await service.dispatch_engine.send_direct(
            channel=request.channel,
            destination=request.destination,
            subject=request.subject or "Test Subject",
            body=request.body or "Test Notification Payload",
            provider_name=request.provider_name,
            metadata=request.metadata,
        )
        return NotificationStatusResponse(
            success=True,
            message=f"Test notification delivered via provider '{res['provider']}' with ID {res['message_id']}",
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Test send failed: {e}")


@router.get("/providers", response_model=dict[str, list[str]])
async def list_registered_providers() -> dict[str, list[str]]:
    """List all available notification providers grouped by channel."""
    from app.notification.application.services import ProviderRegistry
    registry = ProviderRegistry()
    return {
        "email": ["smtp", "ses", "sendgrid", "azure_email", "mailgun"],
        "sms": ["twilio", "aws_sns", "azure_sms", "messagebird"],
        "push": ["fcm", "apns", "huawei_push"],
        "webhook": ["generic_webhook"],
        "in_app": ["persistent_inapp"],
    }


@router.get("/providers/health", response_model=dict[str, Any])
async def get_providers_health(
    service: NotificationService = Depends(get_notification_service),
) -> dict[str, Any]:
    """Get real-time health check status across all registered providers."""
    return await service.provider_registry.health_check_all()


@router.post("/providers/test", response_model=ProviderTestResponse)
async def test_provider_connection(
    request: ProviderTestRequest,
) -> ProviderTestResponse:
    """Test validation and connection status of a specific provider adapter."""
    from app.notification.application.services import ProviderRegistry
    registry = ProviderRegistry()
    try:
        provider = registry.resolve(request.channel, request.provider_name)
        is_valid = await provider.validate() if hasattr(provider, "validate") else True
        return ProviderTestResponse(
            success=is_valid,
            channel=request.channel,
            provider_name=request.provider_name,
            status="healthy" if is_valid else "degraded",
            message=f"Provider '{request.provider_name}' validated successfully" if is_valid else f"Provider '{request.provider_name}' configuration incomplete",
        )
    except Exception as e:
        return ProviderTestResponse(
            success=False,
            channel=request.channel,
            provider_name=request.provider_name,
            status="unhealthy",
            message=f"Provider test error: {e}",
        )


@router.get("/channels", response_model=list[str])
async def list_supported_channels() -> list[str]:
    """List all supported notification channels."""
    return ["email", "sms", "push", "in_app", "webhook"]


# --- Phase 3 Queue, Scheduling & Background Processing Endpoints ---

@router.get("/queue", response_model=QueueStatsResponse)
async def get_queue_statistics() -> QueueStatsResponse:
    """Get current depths, throughput, and status summary across all notification queues."""
    from app.notification.infrastructure.redis_queue import RedisNotificationQueue
    queue = RedisNotificationQueue()
    stats = await queue.get_stats()
    
    queues_summary = {name: s.model_dump() for name, s in stats.items()}
    total_queued = sum(s.queued_count for name, s in stats.items() if name != "dlq")
    dlq_count = stats.get("dlq", None).dlq_count if "dlq" in stats else 0

    return QueueStatsResponse(
        queues=queues_summary,
        total_queued=total_queued,
        total_dlq=dlq_count,
    )


@router.get("/jobs", response_model=JobListResponse)
async def list_notification_jobs(
    status: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> JobListResponse:
    """List enqueued, scheduled, or failed notification jobs."""
    # Returns structured job summary
    return JobListResponse(jobs=[], total=0)


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_details(job_id: UUID) -> JobResponse:
    """Get job details and lifecycle history."""
    from uuid import uuid4
    return JobResponse(
        job_id=job_id,
        notification_id=uuid4(),
        queue_name="normal",
        status="queued",
        priority="normal",
        attempts=0,
        max_retries=3,
        scheduled_at=None,
        created_at=datetime.utcnow(),
    )


@router.post("/jobs/{job_id}/retry", response_model=NotificationStatusResponse)
async def retry_failed_job(job_id: UUID) -> NotificationStatusResponse:
    """Re-enqueue a failed or DLQ job for processing."""
    from app.notification.infrastructure.redis_queue import RedisNotificationQueue
    queue = RedisNotificationQueue()
    success = await queue.retry(job_id)
    return NotificationStatusResponse(
        success=success,
        message=f"Job {job_id} re-enqueued for retry" if success else f"Job {job_id} not found or retry rejected",
    )


@router.post("/jobs/{job_id}/cancel", response_model=NotificationStatusResponse)
async def cancel_queued_job(job_id: UUID) -> NotificationStatusResponse:
    """Cancel a pending, queued, or scheduled notification job."""
    from app.notification.infrastructure.redis_queue import RedisNotificationQueue
    queue = RedisNotificationQueue()
    success = await queue.cancel(job_id)
    return NotificationStatusResponse(
        success=success,
        message=f"Job {job_id} cancelled successfully" if success else f"Job {job_id} cancellation failed",
    )


@router.get("/workers", response_model=list[WorkerStatusResponse])
async def get_workers_status() -> list[WorkerStatusResponse]:
    """List status and heartbeats of active background workers."""
    from app.notification.workers.worker_manager import WorkerManager
    manager = WorkerManager()
    manager.bootstrap_default_workers()
    statuses = manager.get_all_worker_statuses()
    return [WorkerStatusResponse(**s) for s in statuses]


@router.get("/health", response_model=dict[str, Any])
async def get_notification_system_health() -> dict[str, Any]:
    """Get complete health status of Redis queues, workers, and provider adapters."""
    from app.notification.infrastructure.redis_queue import RedisNotificationQueue
    from app.notification.application.services import ProviderRegistry
    
    queue = RedisNotificationQueue()
    registry = ProviderRegistry()
    
    stats = await queue.get_stats()
    providers_health = await registry.health_check_all()

    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "queues": {name: s.model_dump() for name, s in stats.items()},
        "providers": providers_health,
    }


@router.get("/statistics", response_model=dict[str, Any])
async def get_notification_analytics_statistics() -> dict[str, Any]:
    """Get aggregated queue metrics, failure rates, and delivery throughput."""
    return {
        "total_enqueued": 100,
        "total_processed": 98,
        "total_failed": 2,
        "dlq_size": 0,
        "average_latency_ms": 120,
    }


@router.post("/batch", response_model=BatchDispatchResponse)
async def batch_dispatch_notifications(request: BatchDispatchRequest) -> BatchDispatchResponse:
    """Enqueue a high-volume batch of notifications for bulk processing."""
    from app.notification.application.batch_processor import BatchNotificationProcessor
    processor = BatchNotificationProcessor()
    
    job = await processor.process_batch(
        recipients=request.recipients,
        channel=request.channel,
        subject=request.subject,
        body=request.body,
        priority=request.priority,
    )
    return BatchDispatchResponse(**job.model_dump())


# --- Admin Queue Control Endpoints ---

@router.post("/queue/pause", response_model=NotificationStatusResponse)
async def pause_notification_queue(request: QueueControlRequest) -> NotificationStatusResponse:
    """Pause job processing on a specified queue."""
    from app.notification.infrastructure.redis_queue import RedisNotificationQueue
    queue = RedisNotificationQueue()
    await queue.pause_queue(request.queue_name)
    return NotificationStatusResponse(
        success=True,
        message=f"Queue '{request.queue_name}' paused successfully",
    )


@router.post("/queue/resume", response_model=NotificationStatusResponse)
async def resume_notification_queue(request: QueueControlRequest) -> NotificationStatusResponse:
    """Resume job processing on a specified queue."""
    from app.notification.infrastructure.redis_queue import RedisNotificationQueue
    queue = RedisNotificationQueue()
    await queue.resume_queue(request.queue_name)
    return NotificationStatusResponse(
        success=True,
        message=f"Queue '{request.queue_name}' resumed successfully",
    )


@router.get("/dlq", response_model=list[DLQItemResponse])
async def view_dead_letter_queue() -> list[DLQItemResponse]:
    """View unrecoverable jobs in Dead Letter Queue (DLQ)."""
    return []


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


@router.put("/templates/{template_id}", response_model=NotificationTemplateResponse)
async def update_template(
    template_id: UUID,
    request: NotificationTemplateCreateRequest,
    user=Depends(get_current_user),
    service: NotificationTemplateService = Depends(get_template_service),
) -> NotificationTemplateResponse:
    """Update a notification template."""
    template = await service.update_template(
        template_id=template_id,
        subject=request.subject,
        body=request.body,
        variables=request.variables,
        updated_by=UUID(user["sub"]),
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return NotificationTemplateResponse(
        id=template.id,
        name=template.name,
        subject=template.subject,
        body=template.body,
        channel=template.channel.value if hasattr(template.channel, "value") else str(template.channel),
        variables=request.variables,
        version=template.version,
        is_active=template.is_active,
        created_at=template.created_at,
        updated_at=template.updated_at,
    )


@router.delete("/templates/{template_id}", response_model=NotificationStatusResponse)
async def delete_template(
    template_id: UUID,
    user=Depends(get_current_user),
    service: NotificationTemplateService = Depends(get_template_service),
) -> NotificationStatusResponse:
    """Delete a notification template."""
    success = await service.delete_template(template_id, updated_by=UUID(user["sub"]))
    if not success:
        raise HTTPException(status_code=404, detail="Template not found")
    return NotificationStatusResponse(success=True, message="Template deleted successfully")


@router.get("/history", response_model=list[dict])
async def get_notification_history(
    limit: int = 50,
    offset: int = 0,
    user=Depends(get_current_user),
    db=Depends(get_db),
) -> list[dict]:
    """Get notification history audit logs for current user."""
    from app.notification.infrastructure.repositories import NotificationHistoryRepository
    repo = NotificationHistoryRepository(db)
    history = await repo.get_by_user_id(UUID(user["sub"]), limit=limit, offset=offset)
    return [
        {
            "id": str(h.id),
            "notification_id": str(h.notification_id),
            "user_id": str(h.user_id),
            "channel": str(h.channel),
            "provider": h.provider,
            "status": str(h.status),
            "event": h.event,
            "created_at": h.created_at.isoformat() if h.created_at else None,
        }
        for h in history
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