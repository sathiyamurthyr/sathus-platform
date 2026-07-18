"""Authorization repositories."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.authorization.infrastructure.models import (
    Permission,
    Role,
    role_permissions,
    user_roles,
)


class PermissionRepository:
    """Permission repository."""

    def __init__(self, db: AsyncSession):
        """Initialize repository."""
        self._db = db

    async def get_by_id(self, permission_id: UUID) -> Permission | None:
        """Get permission by ID."""
        result = await self._db.execute(select(Permission).where(Permission.id == permission_id))
        return result.scalar_one_or_none()

    async def get_by_resource_action(
        self, resource: str, action: str
    ) -> Permission | None:
        """Get permission by resource and action."""
        result = await self._db.execute(
            select(Permission).where(
                Permission.resource == resource, Permission.action == action
            )
        )
        return result.scalar_one_or_none()

    async def list(self) -> list[Permission]:
        """List all permissions."""
        result = await self._db.execute(select(Permission))
        return list(result.scalars().all())

    async def create(
        self, resource: str, action: str, description: str | None = None, group: str | None = None
    ) -> Permission:
        """Create a new permission."""
        permission = Permission(
            resource=resource, action=action, description=description, group=group
        )
        self._db.add(permission)
        await self._db.commit()
        await self._db.refresh(permission)
        return permission


class RoleRepository:
    """Role repository."""

    def __init__(self, db: AsyncSession):
        """Initialize repository."""
        self._db = db

    async def get_by_id(self, role_id: UUID) -> Role | None:
        """Get role by ID."""
        result = await self._db.execute(select(Role).where(Role.id == role_id))
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Role | None:
        """Get role by name."""
        result = await self._db.execute(select(Role).where(Role.name == name))
        return result.scalar_one_or_none()

    async def list(self) -> list[Role]:
        """List all roles."""
        result = await self._db.execute(select(Role))
        return list(result.scalars().all())

    async def create(
        self, name: str, description: str | None = None, permission_ids: list[UUID] = []
    ) -> Role:
        """Create a new role."""
        role = Role(name=name, description=description)
        self._db.add(role)
        await self._db.commit()
        await self._db.refresh(role)

        if permission_ids:
            for perm_id in permission_ids:
                await self._db.execute(
                    role_permissions.insert().values(
                        role_id=role.id, permission_id=perm_id
                    )
                )
            await self._db.commit()

        return role

    async def update(
        self, role_id: UUID, description: str | None = None, permission_ids: list[UUID] | None = None
    ) -> Role | None:
        """Update a role."""
        role = await self.get_by_id(role_id)
        if not role:
            return None

        if description is not None:
            role.description = description

        if permission_ids is not None:
            # Remove existing permissions
            await self._db.execute(
                role_permissions.delete().where(role_permissions.c.role_id == role_id)
            )
            # Add new permissions
            for perm_id in permission_ids:
                await self._db.execute(
                    role_permissions.insert().values(
                        role_id=role_id, permission_id=perm_id
                    )
                )

        await self._db.commit()
        await self._db.refresh(role)
        return role

    async def delete(self, role_id: UUID) -> bool:
        """Delete a role."""
        role = await self.get_by_id(role_id)
        if not role:
            return False

        await self._db.delete(role)
        await self._db.commit()
        return True


class UserRoleRepository:
    """User-Role repository."""

    def __init__(self, db: AsyncSession):
        """Initialize repository."""
        self._db = db

    async def get_user_roles(self, user_id: UUID) -> list[Role]:
        """Get all roles for a user."""
        result = await self._db.execute(
            select(Role)
            .join(user_roles, user_roles.c.role_id == Role.id)
            .where(user_roles.c.user_id == user_id)
        )
        return list(result.scalars().all())

    async def assign_roles(self, user_id: UUID, role_ids: list[UUID]) -> None:
        """Assign roles to a user."""
        # Remove existing roles
        await self._db.execute(
            user_roles.delete().where(user_roles.c.user_id == user_id)
        )
        # Add new roles
        for role_id in role_ids:
            await self._db.execute(
                user_roles.insert().values(user_id=user_id, role_id=role_id)
            )
        await self._db.commit()

    async def has_role(self, user_id: UUID, role_name: str) -> bool:
        """Check if user has a specific role."""
        result = await self._db.execute(
            select(Role)
            .join(user_roles, user_roles.c.role_id == Role.id)
            .where(user_roles.c.user_id == user_id, Role.name == role_name)
        )
        return result.scalar_one_or_none() is not None