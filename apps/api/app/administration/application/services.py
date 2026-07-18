"""Administration application services."""

from datetime import datetime
from uuid import UUID

from app.administration.domain.models import (
    Organization,
    Tenant,
    FeatureFlag,
    License,
    MaintenanceMode,
    OrganizationStatus,
    TenantStatus,
    FeatureFlagScope,
    LicenseType,
)
from app.administration.infrastructure.repositories import (
    OrganizationRepository,
    TenantRepository,
    FeatureFlagRepository,
    LicenseRepository,
    MaintenanceModeRepository,
)


class OrganizationService:
    """Organization service."""

    def __init__(self, repository: OrganizationRepository):
        self.repository = repository

    async def create_organization(
        self,
        name: str,
        slug: str,
        description: str | None = None,
        parent_id: UUID | None = None,
        settings: dict | None = None,
        branding: dict | None = None,
    ) -> Organization:
        return await self.repository.create(
            name=name,
            slug=slug,
            description=description,
            parent_id=parent_id,
            settings=settings,
            branding=branding,
        )

    async def get_organization(self, org_id: UUID) -> Organization | None:
        return await self.repository.get_by_id(org_id)


class TenantService:
    """Tenant service."""

    def __init__(self, repository: TenantRepository):
        self.repository = repository

    async def create_tenant(
        self,
        name: str,
        slug: str,
        organization_id: UUID,
        settings: dict | None = None,
        branding: dict | None = None,
    ) -> Tenant:
        return await self.repository.create(
            name=name,
            slug=slug,
            organization_id=organization_id,
            settings=settings,
            branding=branding,
        )

    async def get_tenant(self, tenant_id: UUID) -> Tenant | None:
        return await self.repository.get_by_id(tenant_id)


class FeatureFlagService:
    """Feature flag service."""

    def __init__(self, repository: FeatureFlagRepository):
        self.repository = repository

    async def create_flag(
        self,
        key: str,
        name: str,
        scope: FeatureFlagScope = FeatureFlagScope.GLOBAL,
        scope_id: UUID | None = None,
    ) -> FeatureFlag:
        return await self.repository.create(
            key=key,
            name=name,
            scope=scope,
            scope_id=scope_id,
        )

    async def get_flag(self, key: str) -> FeatureFlag | None:
        return await self.repository.get_by_key(key)


class LicenseService:
    """License service."""

    def __init__(self, repository: LicenseRepository):
        self.repository = repository

    async def create_license(
        self,
        organization_id: UUID,
        license_type: LicenseType,
        license_key: str,
        expires_at: datetime | None = None,
    ) -> License:
        return await self.repository.create(
            organization_id=organization_id,
            license_type=license_type,
            license_key=license_key,
            expires_at=expires_at,
        )

    async def get_license(self, org_id: UUID) -> License | None:
        return await self.repository.get_by_organization(org_id)


class MaintenanceModeService:
    """Maintenance mode service."""

    def __init__(self, repository: MaintenanceModeRepository):
        self.repository = repository

    async def get_maintenance_mode(self) -> MaintenanceMode | None:
        return await self.repository.get_current()

    async def set_maintenance_mode(
        self,
        enabled: bool,
        message: str | None = None,
        scheduled_at: datetime | None = None,
        ends_at: datetime | None = None,
    ) -> MaintenanceMode:
        return await self.repository.set_mode(
            enabled=enabled,
            message=message,
            scheduled_at=scheduled_at,
            ends_at=ends_at,
        )