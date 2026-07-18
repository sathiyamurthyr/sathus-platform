"""Lifecycle and background processing domain exceptions."""

from app.core.exceptions import BaseAppException


class LifecycleError(BaseAppException):
    """Base exception for lifecycle errors."""

    pass


class JobExecutionError(LifecycleError):
    """Raised when job execution fails."""

    def __init__(self, message: str = "Job execution failed"):
        super().__init__(message)


class ArchiveFailureError(LifecycleError):
    """Raised when archive operation fails."""

    def __init__(self, message: str = "Archive operation failed"):
        super().__init__(message)


class RestoreFailureError(LifecycleError):
    """Raised when restore operation fails."""

    def __init__(self, message: str = "Restore operation failed"):
        super().__init__(message)


class LifecyclePolicyError(LifecycleError):
    """Raised when lifecycle policy is invalid."""

    def __init__(self, message: str = "Invalid lifecycle policy"):
        super().__init__(message)


class QueueProcessingError(LifecycleError):
    """Raised when queue processing fails."""

    def __init__(self, message: str = "Queue processing failed"):
        super().__init__(message)


class ReconciliationError(LifecycleError):
    """Raised when reconciliation fails."""

    def __init__(self, message: str = "Reconciliation failed"):
        super().__init__(message)