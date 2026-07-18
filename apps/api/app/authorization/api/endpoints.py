"""Authorization API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.authorization.api.dependencies import (
    get_authorization_service,
    get_permission_service,
    get_role_service,
)
from app.authorization.api.schemas import (
    AssignRolesRequest,
    RoleCreateRequest,
    RoleResponse,
    RoleUpdateRequest,
    UserRolesResponse,
)
from app.authorization.application.services import (
    AuthorizationService,
    PermissionService,
    RoleService,
)

router = APIRouter()


@router.get("/permissions", response_model=list[RoleResponse])
async def list_permissions(
    permission_service: PermissionService = Depends(get_permission_service),
) -> list[dict]:
    """List all permissions."""
    return await permission_service.list_permissions()


@router.get("/roles", response_model=list[RoleResponse])
async def list_roles(
    role_service: RoleService = Depends(get_role_service),
) -> list[dict]:
    """List all roles."""
    return await role_service.list_roles()


@router.post("/roles", response_model=RoleResponse, status_code=201)
async def create_role(
    request: RoleCreateRequest,
    role_service: RoleService = Depends(get_role_service),
) -> dict:
    """Create a new role."""
    return await role_service.create_role(
        name=request.name,
        description=request.description,
        permission_ids=request.permission_ids,
    )


@router.patch("/roles/{role_id}", response_model=RoleResponse)
async def update_role(
    role_id: UUID,
    request: RoleUpdateRequest,
    role_service: RoleService = Depends(get_role_service),
) -> dict:
    """Update a role."""
    result = await role_service.update_role(
        role_id=role_id,
        description=request.description,
        permission_ids=request.permission_ids,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Role not found")
    return result


@router.delete("/roles/{role_id}", status_code=204)
async def delete_role(
    role_id: UUID,
    role_service: RoleService = Depends(get_role_service),
) -> None:
    """Delete a role."""
    deleted = await role_service.delete_role(role_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Role not found")


@router.get("/users/{user_id}/roles", response_model=UserRolesResponse)
async def get_user_roles(
    user_id: UUID,
    auth_service: AuthorizationService = Depends(get_authorization_service),
) -> dict:
    """Get roles for a user."""
    roles = await auth_service.get_user_roles(user_id)
    return {"user_id": user_id, "roles": roles}


@router.put("/users/{user_id}/roles", response_model=UserRolesResponse)
async def assign_user_roles(
    user_id: UUID,
    request: AssignRolesRequest,
    auth_service: AuthorizationService = Depends(get_authorization_service),
) -> dict:
    """Assign roles to a user."""
    await auth_service.assign_roles(user_id, request.role_ids)
    roles = await auth_service.get_user_roles(user_id)
    return {"user_id": user_id, "roles": roles}