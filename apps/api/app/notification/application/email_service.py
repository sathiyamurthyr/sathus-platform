"""Email service for notification application layer."""

from typing import Any

from app.core.logging import logger
from app.notification.domain.email_provider import (
    EmailMessage,
    EmailProvider,
    EmailFactory,
    EmailDispatcher,
)
from app.notification.domain.email_exceptions import (
    EmailProviderError,
    DeliveryFailedError,
    QueueError,
)


class EmailService:
    """Email service for sending and managing emails."""

    def __init__(self, provider: EmailProvider | None = None):
        """Initialize email service.

        Args:
            provider: Email provider to use.
        """
        self.provider = provider or EmailFactory.create()
        self.dispatcher = EmailDispatcher(self.provider)

    async def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        html: str | None = None,
        cc: list[str] | None = None,
        bcc: list[str] | None = None,
        reply_to: str | None = None,
        priority: str = "normal",
        attachments: list[dict[str, Any]] | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> str:
        """Send an email.

        Args:
            to: Recipient email address.
            subject: Email subject.
            body: Email body (plain text).
            html: HTML body (optional).
            cc: CC recipients.
            bcc: BCC recipients.
            reply_to: Reply-to address.
            priority: Email priority.
            attachments: Email attachments.
            metadata: Additional metadata.

        Returns:
            Message ID.
        """
        message = EmailMessage(
            to=to,
            subject=subject,
            body=body,
            html=html,
            cc=cc or [],
            bcc=bcc or [],
            reply_to=reply_to,
            priority=priority,
            attachments=attachments or [],
            metadata=metadata or {},
        )
        return await self.dispatcher.dispatch(message)

    async def send_bulk_email(
        self,
        messages: list[dict[str, Any]],
    ) -> list[str]:
        """Send multiple emails.

        Args:
            messages: List of email message data.

        Returns:
            List of message IDs.
        """
        email_messages = [
            EmailMessage(
                to=msg["to"],
                subject=msg["subject"],
                body=msg["body"],
                html=msg.get("html"),
                cc=msg.get("cc", []),
                bcc=msg.get("bcc", []),
                reply_to=msg.get("reply_to"),
                priority=msg.get("priority", "normal"),
                attachments=msg.get("attachments", []),
                metadata=msg.get("metadata", {}),
            )
            for msg in messages
        ]
        return await self.dispatcher.dispatch_bulk(email_messages)

    async def get_delivery_status(self, message_id: str) -> dict[str, Any]:
        """Get delivery status for a message.

        Args:
            message_id: Message ID.

        Returns:
            Status information.
        """
        return await self.provider.get_status(message_id)

    async def validate_provider(self) -> bool:
        """Validate email provider configuration.

        Returns:
            True if valid.
        """
        return await self.provider.validate()


class EmailQueue:
    """Email queue for Redis integration."""

    def __init__(self, redis_client=None):
        """Initialize email queue.

        Args:
            redis_client: Redis client instance.
        """
        self.redis = redis_client
        self.queue_name = "email_queue"
        self.delayed_queue_name = "email_delayed_queue"
        self.scheduled_queue_name = "email_scheduled_queue"

    async def enqueue(
        self,
        message: EmailMessage,
        delay: int | None = None,
    ) -> str:
        """Enqueue an email for sending.

        Args:
            message: Email message.
            delay: Delay in seconds (optional).

        Returns:
            Queue message ID.
        """
        if self.redis is None:
            raise QueueError("Redis client not configured")

        queue_name = self.delayed_queue_name if delay else self.queue_name
        data = {
            "to": message.to,
            "subject": message.subject,
            "body": message.body,
            "html": message.html,
            "cc": message.cc,
            "bcc": message.bcc,
            "reply_to": message.reply_to,
            "priority": message.priority,
            "attachments": message.attachments,
            "metadata": message.metadata,
        }

        if delay:
            await self.redis.zadd(
                queue_name,
                {str(data): delay},
            )
        else:
            await self.redis.lpush(queue_name, str(data))

        return f"queue-{message.to}"

    async def dequeue(self) -> EmailMessage | None:
        """Dequeue an email message.

        Returns:
            Email message or None.
        """
        if self.redis is None:
            raise QueueError("Redis client not configured")

        data = await self.redis.rpop(self.queue_name)
        if data:
            # Parse data back to EmailMessage
            return EmailMessage(
                to=data.get("to", ""),
                subject=data.get("subject", ""),
                body=data.get("body", ""),
                html=data.get("html"),
                cc=data.get("cc", []),
                bcc=data.get("bcc", []),
                reply_to=data.get("reply_to"),
                priority=data.get("priority", "normal"),
                attachments=data.get("attachments", []),
                metadata=data.get("metadata", {}),
            )
        return None

    async def get_queue_length(self) -> int:
        """Get queue length.

        Returns:
            Number of messages in queue.
        """
        if self.redis is None:
            return 0
        return await self.redis.llen(self.queue_name)


class EmailRetryPolicy:
    """Email retry policy with exponential backoff."""

    def __init__(self, max_retries: int = 3, base_delay: float = 1.0):
        """Initialize retry policy.

        Args:
            max_retries: Maximum retry attempts.
            base_delay: Base delay in seconds.
        """
        self.max_retries = max_retries
        self.base_delay = base_delay

    def calculate_delay(self, attempt: int) -> float:
        """Calculate delay for retry attempt.

        Args:
            attempt: Current attempt number.

        Returns:
            Delay in seconds.
        """
        return self.base_delay * (2 ** attempt)

    def should_retry(self, attempt: int, error: Exception) -> bool:
        """Check if should retry.

        Args:
            attempt: Current attempt number.
            error: Error that occurred.

        Returns:
            True if should retry.
        """
        return attempt < self.max_retries and isinstance(
            error,
            (EmailProviderError, DeliveryFailedError),
        )