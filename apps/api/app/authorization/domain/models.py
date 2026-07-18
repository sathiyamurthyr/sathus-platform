"""Authorization domain models."""

from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field


class PermissionAction(StrEnum):
    """Permission action enumeration."""

    READ = "read"
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    PUBLISH = "publish"
    REVIEW = "review"
    MANAGE = "manage"
    ACCESS = "access"


class Permission(BaseModel):
    """Permission entity."""

    id: UUID
    resource: str
    action: PermissionAction
    description: str | None = None
    group: str | None = None
    is_system: bool = False

    class Config:
        """Pydantic config."""

        frozen = True


class Role(BaseModel):
    """Role entity."""

    id: UUID
    name: str
    description: str | None = None
    is_system: bool = False
    permissions: list[Permission] = Field(default_factory=list)

    class Config:
        """Pydantic config."""

        frozen = True


class RolePermission(BaseModel):
    """Role-Permission association."""

    role_id: UUID
    permission_id: UUID

    class Config:
        """Pydantic config."""

        frozen = True


class UserRole(BaseModel):
    """User-Role association."""

    user_id: UUID
    role_id: UUID

    class Config:
        """Pydantic config."""

        frozen = True


class PermissionGroup(BaseModel):
    """Permission group for organization."""

    id: UUID
    name: str
    description: str | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class AuthorizationPolicy(BaseModel):
    """Authorization policy definition."""

    id: UUID
    name: str
    description: str | None = None
    permission_required: str
    resource_type: str | None = None
    conditions: dict | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class PermissionAssignment(BaseModel):
    """Direct permission assignment to user."""

    id: UUID
    user_id: UUID
    permission_id: UUID
    granted_by: UUID | None = None
    expires_at: str | None = None

    class Config:
        """Pydantic config."""

        frozen = True