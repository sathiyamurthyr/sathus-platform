"""Authorization API schemas."""

from uuid import UUID

from pydantic import BaseModel


class PermissionResponse(BaseModel):
    """Permission response schema."""

    id: UUID
    resource: str
    action: str
    description: str | None = None
    group: str | None = None


class RoleResponse(BaseModel):
    """Role response schema."""

    id: UUID
    name: str
    description: str | None = None
    permissions: list[PermissionResponse] = []


class RoleCreateRequest(BaseModel):
    """Role creation request."""

    name: str
    description: str | None = None
    permission_ids: list[UUID] = []


class RoleUpdateRequest(BaseModel):
    """Role update request."""

    description: str | None = None
    permission_ids: list[UUID] | None = None


class UserRolesResponse(BaseModel):
    """User roles response schema."""

    user_id: UUID
    roles: list[RoleResponse]


class AssignRolesRequest(BaseModel):
    """Assign roles to user request."""

    role_ids: list[UUID]