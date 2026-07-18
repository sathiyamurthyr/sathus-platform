"""Administration repositories."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.administration.infrastructure.models import (
    Organization,
    Tenant,
    Department,
    Environment,
    FeatureFlag,
    PlatformSetting,
    License,
    Quota,
    MaintenanceMode,
    OrganizationStatus,
    TenantStatus,
    EnvironmentType,
    FeatureFlagScope,
    LicenseType,
)


class OrganizationRepository:
    """Organization repository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        name: str,
        slug: str,
        description: str | None = None,
        parent_id: UUID | None = None,
        settings: dict | None = None,
        branding: dict | None = None,
    ) -> Organization:
        org = Organization(
            name=name,
            slug=slug,
            description=description,
            parent_id=parent_id,
            settings=settings or {},
            branding=branding or {},
        )
        self.session.add(org)
        await self.session.flush()
        return org

    async def get_by_id(self, org_id: UUID) -> Organization | None:
        result = await self.session.execute(select(Organization).where(Organization.id == org_id))
        return result.scalar_one_or_none()


class TenantRepository:
    """Tenant repository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        name: str,
        slug: str,
        organization_id: UUID,
        settings: dict | None = None,
        branding: dict | None = None,
    ) -> Tenant:
        tenant = Tenant(
            name=name,
            slug=slug,
            organization_id=organization_id,
            settings=settings or {},
            branding=branding or {},
        )
        self.session.add(tenant)
        await self.session.flush()
        return tenant

    async def get_by_id(self, tenant_id: UUID) -> Tenant | None:
        result = await self.session.execute(select(Tenant).where(Tenant.id == tenant_id))
        return result.scalar_one_or_none()


class FeatureFlagRepository:
    """Feature flag repository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        key: str,
        name: str,
        scope: FeatureFlagScope = FeatureFlagScope.GLOBAL,
        scope_id: UUID | None = None,
    ) -> FeatureFlag:
        flag = FeatureFlag(key=key, name=name, scope=scope, scope_id=scope_id)
        self.session.add(flag)
        await self.session.flush()
        return flag

    async def get_by_key(self, key: str) -> FeatureFlag | None:
        result = await self.session.execute(select(FeatureFlag).where(FeatureFlag.key == key))
        return result.scalar_one_or_none()


class LicenseRepository:
    """License repository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        organization_id: UUID,
        license_type: LicenseType,
        license_key: str,
        expires_at: datetime | None = None,
    ) -> License:
        license = License(
            organization_id=organization_id,
            license_type=license_type,
            license_key=license_key,
            expires_at=expires_at,
        )
        self.session.add(license)
        await self.session.flush()
        return license

    async def get_by_organization(self, org_id: UUID) -> License | None:
        result = await self.session.execute(
            select(License).where(License.organization_id == org_id)
        )
        return result.scalar_one_or_none()


class MaintenanceModeRepository:
    """Maintenance mode repository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_current(self) -> MaintenanceMode | None:
        result = await self.session.execute(select(MaintenanceMode))
        return result.scalar_one_or_none()

    async def set_mode(
        self,
        enabled: bool,
        message: str | None = None,
        scheduled_at: datetime | None = None,
        ends_at: datetime | None = None,
    ) -> MaintenanceMode:
        mode = await self.get_current()
        if mode:
            mode.enabled = enabled
            if message:
                mode.message = message
            if scheduled_at:
                mode.scheduled_at = scheduled_at
            if ends_at:
                mode.ends_at = ends_at
        else:
            mode = MaintenanceMode(
                enabled=enabled,
                message=message,
                scheduled_at=scheduled_at,
                ends_at=ends_at,
            )
            self.session.add(mode)
        await self.session.flush()
        return mode