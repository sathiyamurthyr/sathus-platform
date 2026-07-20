"""Event Bus Handlers for platform triggers auto-enqueueing notifications."""

from uuid import UUID, uuid4

from app.core.logging import logger
from app.notification.domain.events import (
    ContentPublished,
    InvoicePaid,
    LoginSuccess,
    MediaUploaded,
    PasswordReset,
    ProjectCreated,
    SubscriptionActivated,
    TaskAssigned,
    UserRegistered,
)
from app.notification.infrastructure.redis_queue import RedisNotificationQueue


class EventBusNotificationRouter:
    """Listens for platform domain events and automatically enqueues corresponding notifications."""

    def __init__(self, queue: RedisNotificationQueue | None = None):
        self.queue = queue or RedisNotificationQueue()

    async def handle_user_registered(self, event: UserRegistered) -> UUID:
        notif_id = uuid4()
        payload = {
            "channel": "email",
            "destination": event.email,
            "subject": "Welcome to Sathus Platform!",
            "body": f"Hello! Your account was registered successfully on {event.registered_at.isoformat()}.",
            "category": "user",
            "priority": "high",
        }
        await self.queue.enqueue(notif_id, payload)
        logger.info(f"[EventBusRouter] Auto-enqueued UserRegistered welcome email for {event.email}")
        return notif_id

    async def handle_password_reset(self, event: PasswordReset) -> UUID:
        notif_id = uuid4()
        payload = {
            "channel": "email",
            "destination": event.email,
            "subject": "Password Reset Requested",
            "body": f"Your password reset token is {event.reset_token}. It will expire shortly.",
            "category": "security",
            "priority": "critical",
        }
        await self.queue.enqueue(notif_id, payload)
        logger.info(f"[EventBusRouter] Auto-enqueued PasswordReset security email for {event.email}")
        return notif_id

    async def handle_invoice_paid(self, event: InvoicePaid) -> UUID:
        notif_id = uuid4()
        payload = {
            "channel": "email",
            "destination": f"customer_{event.customer_id}@example.com",
            "subject": f"Payment Receipt - Invoice {event.invoice_id}",
            "body": f"Payment of {event.amount_cents / 100:.2f} {event.currency} received on {event.paid_at.isoformat()}.",
            "category": "billing",
            "priority": "high",
        }
        await self.queue.enqueue(notif_id, payload)
        logger.info(f"[EventBusRouter] Auto-enqueued InvoicePaid receipt for invoice {event.invoice_id}")
        return notif_id

    async def handle_task_assigned(self, event: TaskAssigned) -> UUID:
        notif_id = uuid4()
        payload = {
            "channel": "in_app",
            "destination": str(event.assignee_id),
            "subject": "New Task Assigned",
            "body": f"You were assigned task '{event.task_name}' by user {event.assigner_id}.",
            "category": "workflow",
            "priority": "normal",
        }
        await self.queue.enqueue(notif_id, payload)
        logger.info(f"[EventBusRouter] Auto-enqueued TaskAssigned in-app notification for user {event.assignee_id}")
        return notif_id

    async def handle_system_alert(self, alert_name: str, details: str) -> UUID:
        notif_id = uuid4()
        payload = {
            "channel": "webhook",
            "destination": "https://hooks.sathus.com/alerts",
            "subject": f"System Alert: {alert_name}",
            "body": details,
            "category": "alert",
            "priority": "critical",
        }
        await self.queue.enqueue(notif_id, payload)
        logger.info(f"[EventBusRouter] Auto-enqueued SystemAlert webhook for {alert_name}")
        return notif_id
