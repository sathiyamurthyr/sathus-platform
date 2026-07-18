"""SMS service for notification application layer."""

from typing import Any

from app.core.logging import logger
from app.notification.domain.sms_provider import (
    SmsMessage,
    SmsProvider,
    SmsFactory,
    SmsDispatcher,
)
from app.notification.domain.sms_exceptions import (
    SmsProviderError,
    DeliveryFailedError,
    QueueError,
    InvalidPhoneNumberError,
)


class SmsService:
    """SMS service for sending and managing SMS messages."""

    def __init__(self, provider: SmsProvider | None = None):
        """Initialize SMS service.

        Args:
            provider: SMS provider to use.
        """
        self.provider = provider or SmsFactory.create()
        self.dispatcher = SmsDispatcher(self.provider)

    async def send_sms(
        self,
        to: str,
        body: str,
        from_number: str | None = None,
        priority: str = "normal",
        message_type: str = "transactional",
        unicode: bool = True,
        metadata: dict[str, Any] | None = None,
    ) -> str:
        """Send an SMS.

        Args:
            to: Recipient phone number.
            body: SMS body.
            from_number: Sender phone number.
            priority: SMS priority.
            message_type: Type of message (transactional, promotional, otp).
            unicode: Enable unicode support.
            metadata: Additional metadata.

        Returns:
            Message ID.
        """
        # Validate phone number
        if not await self.dispatcher.validate_phone(to):
            raise InvalidPhoneNumberError(f"Invalid phone number: {to}")

        message = SmsMessage(
            to=to,
            body=body,
            from_number=from_number,
            priority=priority,
            message_type=message_type,
            unicode=unicode,
            metadata=metadata or {},
        )
        return await self.dispatcher.dispatch(message)

    async def send_bulk_sms(
        self,
        messages: list[dict[str, Any]],
    ) -> list[str]:
        """Send multiple SMS messages.

        Args:
            messages: List of SMS message data.

        Returns:
            List of message IDs.
        """
        sms_messages = [
            SmsMessage(
                to=msg["to"],
                body=msg["body"],
                from_number=msg.get("from_number"),
                priority=msg.get("priority", "normal"),
                message_type=msg.get("message_type", "transactional"),
                unicode=msg.get("unicode", True),
                metadata=msg.get("metadata", {}),
            )
            for msg in messages
        ]
        return await self.dispatcher.dispatch_bulk(sms_messages)

    async def get_delivery_status(self, message_id: str) -> dict[str, Any]:
        """Get delivery status for a message.

        Args:
            message_id: Message ID.

        Returns:
            Status information.
        """
        return await self.provider.get_status(message_id)

    async def validate_provider(self) -> bool:
        """Validate SMS provider configuration.

        Returns:
            True if valid.
        """
        return await self.provider.validate()

    async def validate_phone(self, phone_number: str) -> bool:
        """Validate a phone number.

        Args:
            phone_number: Phone number to validate.

        Returns:
            True if valid.
        """
        return await self.dispatcher.validate_phone(phone_number)


class SmsQueue:
    """SMS queue for Redis integration."""

    def __init__(self, redis_client=None):
        """Initialize SMS queue.

        Args:
            redis_client: Redis client instance.
        """
        self.redis = redis_client
        self.queue_name = "sms_queue"
        self.delayed_queue_name = "sms_delayed_queue"
        self.scheduled_queue_name = "sms_scheduled_queue"

    async def enqueue(
        self,
        message: SmsMessage,
        delay: int | None = None,
    ) -> str:
        """Enqueue an SMS for sending.

        Args:
            message: SMS message.
            delay: Delay in seconds (optional).

        Returns:
            Queue message ID.
        """
        if self.redis is None:
            raise QueueError("Redis client not configured")

        queue_name = self.delayed_queue_name if delay else self.queue_name
        data = {
            "to": message.to,
            "body": message.body,
            "from_number": message.from_number,
            "priority": message.priority,
            "message_type": message.message_type,
            "unicode": message.unicode,
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

    async def dequeue(self) -> SmsMessage | None:
        """Dequeue an SMS message.

        Returns:
            SMS message or None.
        """
        if self.redis is None:
            raise QueueError("Redis client not configured")

        data = await self.redis.rpop(self.queue_name)
        if data:
            return SmsMessage(
                to=data.get("to", ""),
                body=data.get("body", ""),
                from_number=data.get("from_number"),
                priority=data.get("priority", "normal"),
                message_type=data.get("message_type", "transactional"),
                unicode=data.get("unicode", True),
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


class SmsRetryPolicy:
    """SMS retry policy with exponential backoff."""

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
            (SmsProviderError, DeliveryFailedError),
        )