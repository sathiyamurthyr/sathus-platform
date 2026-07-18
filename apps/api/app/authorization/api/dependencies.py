"""Authorization FastAPI dependencies."""

from uuid import UUID

from fastapi import Depends, HTTPException

from app.authorization.application.services import AuthorizationService
from app.authorization.infrastructure.repositories import (
    PermissionRepository,
    RoleRepository,
    UserRoleRepository,
)
from app.core.database import get_db


async def get_authorization_service(
    db=Depends(get_db),
) -> AuthorizationService:
    """Get authorization service."""
    return AuthorizationService(
        user_role_repo=UserRoleRepository(db),
        permission_repo=PermissionRepository(db),
    )


async def get_role_service(
    db=Depends(get_db),
) -> "RoleService":
    """Get role service."""
    from app.authorization.application.services import RoleService

    return RoleService(
        role_repo=RoleRepository(db),
        permission_repo=PermissionRepository(db),
    )


async def get_permission_service(
    db=Depends(get_db),
) -> "PermissionService":
    """Get permission service."""
    from app.authorization.application.services import PermissionService

    return PermissionService(permission_repo=PermissionRepository(db))


def RequirePermission(permission: str):
    """Create a dependency that requires a specific permission."""

    async def check_permission(
        user_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
        auth_service: AuthorizationService = Depends(get_authorization_service),
    ) -> None:
        """Check permission."""
        has_perm = await auth_service.has_permission(user_id, permission)
        if not has_perm:
            raise HTTPException(
                status_code=403,
                detail=f"Permission '{permission}' required",
            )

    return check_permission


def RequireAnyPermission(permissions: list[str]):
    """Create a dependency that requires any of the specified permissions."""

    async def check_any_permission(
        user_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
        auth_service: AuthorizationService = Depends(get_authorization_service),
    ) -> None:
        """Check any permission."""
        for perm in permissions:
            if await auth_service.has_permission(user_id, perm):
                return
        raise HTTPException(
            status_code=403,
            detail=f"One of permissions {permissions} required",
        )

    return check_any_permission


def RequireAllPermissions(permissions: list[str]):
    """Create a dependency that requires all specified permissions."""

    async def check_all_permissions(
        user_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
        auth_service: AuthorizationService = Depends(get_authorization_service),
    ) -> None:
        """Check all permissions."""
        for perm in permissions:
            if not await auth_service.has_permission(user_id, perm):
                raise HTTPException(
                    status_code=403,
                    detail=f"Permission '{perm}' required",
                )

    return check_all_permissions


def RequireRole(role_name: str):
    """Create a dependency that requires a specific role."""

    async def check_role(
        user_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
        auth_service: AuthorizationService = Depends(get_authorization_service),
    ) -> None:
        """Check role."""
        has_role = await auth_service.has_role(user_id, role_name)
        if not has_role:
            raise HTTPException(
                status_code=403,
                detail=f"Role '{role_name}' required",
            )

    return check_role