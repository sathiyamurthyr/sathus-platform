"""Authorization policies."""

from abc import ABC, abstractmethod
from uuid import UUID


class AuthorizationPolicy(ABC):
    """Base authorization policy."""

    @abstractmethod
    def check(self, user_id: UUID, resource: str | None = None) -> bool:
        """Check if user can perform action."""
        pass


class CanPublishContent(AuthorizationPolicy):
    """Policy for publishing content."""

    def __init__(self, auth_service):
        """Initialize policy."""
        self._auth_service = auth_service

    async def check(self, user_id: UUID, resource: str | None = None) -> bool:
        """Check if user can publish content."""
        return await self._auth_service.has_permission(user_id, "content.page.publish")


class CanApproveWorkflow(AuthorizationPolicy):
    """Policy for approving workflows."""

    def __init__(self, auth_service):
        """Initialize policy."""
        self._auth_service = auth_service

    async def check(self, user_id: UUID, resource: str | None = None) -> bool:
        """Check if user can approve workflow."""
        return await self._auth_service.has_permission(user_id, "workflow.review")


class CanManageUsers(AuthorizationPolicy):
    """Policy for managing users."""

    def __init__(self, auth_service):
        """Initialize policy."""
        self._auth_service = auth_service

    async def check(self, user_id: UUID, resource: str | None = None) -> bool:
        """Check if user can manage users."""
        return await self._auth_service.has_permission(user_id, "identity.user.manage")


class CanUploadMedia(AuthorizationPolicy):
    """Policy for uploading media."""

    def __init__(self, auth_service):
        """Initialize policy."""
        self._auth_service = auth_service

    async def check(self, user_id: UUID, resource: str | None = None) -> bool:
        """Check if user can upload media."""
        return await self._auth_service.has_permission(user_id, "media.asset.upload")


class CanManageRoles(AuthorizationPolicy):
    """Policy for managing roles."""

    def __init__(self, auth_service):
        """Initialize policy."""
        self._auth_service = auth_service

    async def check(self, user_id: UUID, resource: str | None = None) -> bool:
        """Check if user can manage roles."""
        return await self._auth_service.has_permission(user_id, "admin.access")


class PolicyEvaluator:
    """Policy evaluator for multiple policies."""

    def __init__(self, auth_service):
        """Initialize evaluator."""
        self._auth_service = auth_service
        self._policies = {
            "can_publish_content": CanPublishContent(auth_service),
            "can_approve_workflow": CanApproveWorkflow(auth_service),
            "can_manage_users": CanManageUsers(auth_service),
            "can_upload_media": CanUploadMedia(auth_service),
            "can_manage_roles": CanManageRoles(auth_service),
        }

    async def evaluate(self, policy_name: str, user_id: UUID, resource: str | None = None) -> bool:
        """Evaluate a policy."""
        policy = self._policies.get(policy_name)
        if not policy:
            return False
        return await policy.check(user_id, resource)

    def register_policy(self, name: str, policy: AuthorizationPolicy) -> None:
        """Register a custom policy."""
        self._policies[name] = policy