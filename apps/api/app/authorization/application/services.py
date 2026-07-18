"""Authorization application services."""

from uuid import UUID

from app.authorization.infrastructure.repositories import (
    PermissionRepository,
    RoleRepository,
    UserRoleRepository,
)


class PermissionService:
    """Permission management service."""

    def __init__(self, permission_repo: PermissionRepository):
        """Initialize service."""
        self._permission_repo = permission_repo

    async def get_permission(self, permission_id: UUID) -> dict | None:
        """Get permission by ID."""
        permission = await self._permission_repo.get_by_id(permission_id)
        if not permission:
            return None
        return {
            "id": permission.id,
            "resource": permission.resource,
            "action": permission.action,
            "description": permission.description,
            "group": permission.group,
        }

    async def get_permission_by_name(self, resource: str, action: str) -> dict | None:
        """Get permission by resource and action."""
        permission = await self._permission_repo.get_by_resource_action(resource, action)
        if not permission:
            return None
        return {
            "id": permission.id,
            "resource": permission.resource,
            "action": permission.action,
            "description": permission.description,
            "group": permission.group,
        }

    async def list_permissions(self) -> list[dict]:
        """List all permissions."""
        permissions = await self._permission_repo.list()
        return [
            {
                "id": p.id,
                "resource": p.resource,
                "action": p.action,
                "description": p.description,
                "group": p.group,
            }
            for p in permissions
        ]

    async def create_permission(
        self, resource: str, action: str, description: str | None = None, group: str | None = None
    ) -> dict:
        """Create a new permission."""
        permission = await self._permission_repo.create(
            resource=resource, action=action, description=description, group=group
        )
        return {
            "id": permission.id,
            "resource": permission.resource,
            "action": permission.action,
            "description": permission.description,
            "group": permission.group,
        }


class RoleService:
    """Role management service."""

    def __init__(self, role_repo: RoleRepository, permission_repo: PermissionRepository):
        """Initialize service."""
        self._role_repo = role_repo
        self._permission_repo = permission_repo

    async def get_role(self, role_id: UUID) -> dict | None:
        """Get role by ID."""
        role = await self._role_repo.get_by_id(role_id)
        if not role:
            return None
        return {
            "id": role.id,
            "name": role.name,
            "description": role.description,
            "permissions": [
                {
                    "id": p.id,
                    "resource": p.resource,
                    "action": p.action,
                    "description": p.description,
                    "group": p.group,
                }
                for p in role.permissions
            ],
        }

    async def get_role_by_name(self, name: str) -> dict | None:
        """Get role by name."""
        role = await self._role_repo.get_by_name(name)
        if not role:
            return None
        return {
            "id": role.id,
            "name": role.name,
            "description": role.description,
            "permissions": [
                {
                    "id": p.id,
                    "resource": p.resource,
                    "action": p.action,
                    "description": p.description,
                    "group": p.group,
                }
                for p in role.permissions
            ],
        }

    async def list_roles(self) -> list[dict]:
        """List all roles."""
        roles = await self._role_repo.list()
        return [
            {
                "id": r.id,
                "name": r.name,
                "description": r.description,
            }
            for r in roles
        ]

    async def create_role(
        self, name: str, description: str | None = None, permission_ids: list[UUID] = []
    ) -> dict:
        """Create a new role."""
        role = await self._role_repo.create(
            name=name, description=description, permission_ids=permission_ids
        )
        return {
            "id": role.id,
            "name": role.name,
            "description": role.description,
        }

    async def update_role(
        self, role_id: UUID, description: str | None = None, permission_ids: list[UUID] | None = None
    ) -> dict | None:
        """Update a role."""
        role = await self._role_repo.update(
            role_id=role_id, description=description, permission_ids=permission_ids
        )
        if not role:
            return None
        return {
            "id": role.id,
            "name": role.name,
            "description": role.description,
        }

    async def delete_role(self, role_id: UUID) -> bool:
        """Delete a role."""
        return await self._role_repo.delete(role_id)


class AuthorizationService:
    """Authorization service."""

    def __init__(
        self,
        user_role_repo: UserRoleRepository,
        permission_repo: PermissionRepository,
    ):
        """Initialize service."""
        self._user_role_repo = user_role_repo
        self._permission_repo = permission_repo

    async def get_user_permissions(self, user_id: UUID) -> list[str]:
        """Get all permission strings for a user."""
        roles = await self._user_role_repo.get_user_roles(user_id)
        permissions = set()
        for role in roles:
            for perm in role.permissions:
                permissions.add(f"{perm.resource}.{perm.action}")
        return list(permissions)

    async def has_permission(self, user_id: UUID, permission: str) -> bool:
        """Check if user has a specific permission."""
        user_permissions = await self.get_user_permissions(user_id)
        return permission in user_permissions

    async def has_role(self, user_id: UUID, role_name: str) -> bool:
        """Check if user has a specific role."""
        return await self._user_role_repo.has_role(user_id, role_name)

    async def get_user_roles(self, user_id: UUID) -> list[dict]:
        """Get all roles for a user."""
        roles = await self._user_role_repo.get_user_roles(user_id)
        return [
            {
                "id": r.id,
                "name": r.name,
                "description": r.description,
            }
            for r in roles
        ]

    async def assign_roles(self, user_id: UUID, role_ids: list[UUID]) -> None:
        """Assign roles to a user."""
        await self._user_role_repo.assign_roles(user_id, role_ids)