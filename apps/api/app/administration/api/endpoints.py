"""Administration API endpoints."""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.administration.api.schemas import (
    OrganizationResponse,
    OrganizationCreate,
    TenantResponse,
    TenantCreate,
    FeatureFlagResponse,
    FeatureFlagCreate,
    LicenseResponse,
    LicenseCreate,
    MaintenanceModeResponse,
    MaintenanceModeSet,
)
from app.administration.application.services import (
    OrganizationService,
    TenantService,
    FeatureFlagService,
    LicenseService,
    MaintenanceModeService,
)
from app.administration.infrastructure.repositories import (
    OrganizationRepository,
    TenantRepository,
    FeatureFlagRepository,
    LicenseRepository,
    MaintenanceModeRepository,
)
from app.core.database import get_db

router = APIRouter()


async def get_organization_service(
    session: AsyncSession = Depends(get_db),
) -> OrganizationService:
    """Get organization service."""
    return OrganizationService(OrganizationRepository(session))


@router.post("/organizations", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    org: OrganizationCreate,
    service: OrganizationService = Depends(get_organization_service),
) -> OrganizationResponse:
    """Create an organization."""
    created = await service.create_organization(
        name=org.name,
        slug=org.slug,
        description=org.description,
        parent_id=org.parent_id,
        settings=org.settings,
        branding=org.branding,
    )
    return OrganizationResponse(
        id=created.id,
        name=created.name,
        slug=created.slug,
        description=created.description,
        status=created.status.value,
        parent_id=created.parent_id,
        settings=created.settings,
        branding=created.branding,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


async def get_tenant_service(
    session: AsyncSession = Depends(get_db),
) -> TenantService:
    """Get tenant service."""
    return TenantService(TenantRepository(session))


@router.post("/tenants", response_model=TenantResponse, status_code=status.HTTP_201_CREATED)
async def create_tenant(
    tenant: TenantCreate,
    service: TenantService = Depends(get_tenant_service),
) -> TenantResponse:
    """Create a tenant."""
    created = await service.create_tenant(
        name=tenant.name,
        slug=tenant.slug,
        organization_id=tenant.organization_id,
        settings=tenant.settings,
        branding=tenant.branding,
    )
    return TenantResponse(
        id=created.id,
        name=created.name,
        slug=created.slug,
        organization_id=created.organization_id,
        status=created.status.value,
        settings=created.settings,
        branding=created.branding,
        storage_limit_gb=created.storage_limit_gb,
        ai_token_limit=created.ai_token_limit,
        notification_limit=created.notification_limit,
        workflow_limit=created.workflow_limit,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


async def get_feature_flag_service(
    session: AsyncSession = Depends(get_db),
) -> FeatureFlagService:
    """Get feature flag service."""
    return FeatureFlagService(FeatureFlagRepository(session))


@router.post("/feature-flags", response_model=FeatureFlagResponse, status_code=status.HTTP_201_CREATED)
async def create_feature_flag(
    flag: FeatureFlagCreate,
    service: FeatureFlagService = Depends(get_feature_flag_service),
) -> FeatureFlagResponse:
    """Create a feature flag."""
    created = await service.create_flag(
        key=flag.key,
        name=flag.name,
        scope=flag.scope,
        scope_id=flag.scope_id,
    )
    return FeatureFlagResponse(
        id=created.id,
        key=created.key,
        name=created.name,
        description=created.description,
        scope=created.scope.value,
        scope_id=created.scope_id,
        enabled=created.enabled,
        rollout_percentage=created.rollout_percentage,
        dependencies=created.dependencies,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


async def get_license_service(
    session: AsyncSession = Depends(get_db),
) -> LicenseService:
    """Get license service."""
    return LicenseService(LicenseRepository(session))


@router.post("/licenses", response_model=LicenseResponse, status_code=status.HTTP_201_CREATED)
async def create_license(
    license: LicenseCreate,
    service: LicenseService = Depends(get_license_service),
) -> LicenseResponse:
    """Create a license."""
    created = await service.create_license(
        organization_id=license.organization_id,
        license_type=license.license_type,
        license_key=license.license_key,
        expires_at=license.expires_at,
    )
    return LicenseResponse(
        id=created.id,
        organization_id=created.organization_id,
        license_type=created.license_type.value,
        license_key=created.license_key,
        expires_at=created.expires_at,
        max_users=created.max_users,
        max_tenants=created.max_tenants,
        features=created.features,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


async def get_maintenance_mode_service(
    session: AsyncSession = Depends(get_db),
) -> MaintenanceModeService:
    """Get maintenance mode service."""
    return MaintenanceModeService(MaintenanceModeRepository(session))


@router.get("/maintenance", response_model=MaintenanceModeResponse)
async def get_maintenance_mode(
    service: MaintenanceModeService = Depends(get_maintenance_mode_service),
) -> MaintenanceModeResponse:
    """Get current maintenance mode."""
    mode = await service.get_maintenance_mode()
    if not mode:
        return MaintenanceModeResponse(
            id=UUID(int=0),
            enabled=False,
            created_at=datetime.now(datetime.timezone.utc),
        )
    return MaintenanceModeResponse(
        id=mode.id,
        enabled=mode.enabled,
        message=mode.message,
        scheduled_at=mode.scheduled_at,
        ends_at=mode.ends_at,
        created_at=mode.created_at,
        updated_at=mode.updated_at,
    )


@router.post("/maintenance", response_model=MaintenanceModeResponse)
async def set_maintenance_mode(
    payload: MaintenanceModeSet,
    service: MaintenanceModeService = Depends(get_maintenance_mode_service),
) -> MaintenanceModeResponse:
    """Set maintenance mode."""
    mode = await service.set_maintenance_mode(
        enabled=payload.enabled,
        message=payload.message,
        scheduled_at=payload.scheduled_at,
        ends_at=payload.ends_at,
    )
    return MaintenanceModeResponse(
        id=mode.id,
        enabled=mode.enabled,
        message=mode.message,
        scheduled_at=mode.scheduled_at,
        ends_at=mode.ends_at,
        created_at=mode.created_at,
        updated_at=mode.updated_at,
    )