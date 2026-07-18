"""Administration API schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class OrganizationResponse(BaseModel):
    """Organization response schema."""

    id: UUID
    name: str
    slug: str
    description: str | None = None
    status: str
    parent_id: UUID | None = None
    settings: dict = Field(default_factory=dict)
    branding: dict = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime | None = None


class OrganizationCreate(BaseModel):
    """Organization create schema."""

    name: str
    slug: str
    description: str | None = None
    parent_id: UUID | None = None
    settings: dict = Field(default_factory=dict)
    branding: dict = Field(default_factory=dict)


class TenantResponse(BaseModel):
    """Tenant response schema."""

    id: UUID
    name: str
    slug: str
    organization_id: UUID
    status: str
    settings: dict = Field(default_factory=dict)
    branding: dict = Field(default_factory=dict)
    storage_limit_gb: int = 10
    ai_token_limit: int = 10000
    notification_limit: int = 1000
    workflow_limit: int = 100
    created_at: datetime
    updated_at: datetime | None = None


class TenantCreate(BaseModel):
    """Tenant create schema."""

    name: str
    slug: str
    organization_id: UUID
    settings: dict = Field(default_factory=dict)
    branding: dict = Field(default_factory=dict)


class FeatureFlagResponse(BaseModel):
    """Feature flag response schema."""

    id: UUID
    key: str
    name: str
    description: str | None = None
    scope: str
    scope_id: UUID | None = None
    enabled: bool = False
    rollout_percentage: int = 0
    dependencies: list[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime | None = None


class FeatureFlagCreate(BaseModel):
    """Feature flag create schema."""

    key: str
    name: str
    description: str | None = None
    scope: str = "global"
    scope_id: UUID | None = None


class LicenseResponse(BaseModel):
    """License response schema."""

    id: UUID
    organization_id: UUID
    license_type: str
    license_key: str
    expires_at: datetime | None = None
    max_users: int = 10
    max_tenants: int = 1
    features: list[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime | None = None


class LicenseCreate(BaseModel):
    """License create schema."""

    organization_id: UUID
    license_type: str
    license_key: str
    expires_at: datetime | None = None


class MaintenanceModeResponse(BaseModel):
    """Maintenance mode response schema."""

    id: UUID
    enabled: bool = False
    message: str | None = None
    scheduled_at: datetime | None = None
    ends_at: datetime | None = None
    created_at: datetime
    updated_at: datetime | None = None


class MaintenanceModeSet(BaseModel):
    """Maintenance mode set schema."""

    enabled: bool
    message: str | None = None
    scheduled_at: datetime | None = None
    ends_at: datetime | None = None