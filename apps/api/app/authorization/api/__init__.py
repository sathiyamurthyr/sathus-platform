"""Authorization API module."""

from app.authorization.api.schemas import (
    AssignRolesRequest,
    RoleCreateRequest,
    RoleResponse,
    RoleUpdateRequest,
    UserRolesResponse,
)
from app.authorization.api.dependencies import (
    RequireAllPermissions,
    RequireAnyPermission,
    RequirePermission,
    RequireRole,
    get_authorization_service,
    get_permission_service,
    get_role_service,
)

__all__ = [
    "RoleResponse",
    "RoleCreateRequest",
    "RoleUpdateRequest",
    "UserRolesResponse",
    "AssignRolesRequest",
    "RequirePermission",
    "RequireAnyPermission",
    "RequireAllPermissions",
    "RequireRole",
    "get_authorization_service",
    "get_permission_service",
    "get_role_service",
]