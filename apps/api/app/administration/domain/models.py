"""Administration domain models."""

from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field


class OrganizationStatus(str, Enum):
    """Organization status enumeration."""

    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    ARCHIVED = "archived"


class TenantStatus(str, Enum):
    """Tenant status enumeration."""

    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"


class EnvironmentType(str, Enum):
    """Environment type enumeration."""

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class FeatureFlagScope(str, Enum):
    """Feature flag scope enumeration."""

    GLOBAL = "global"
    TENANT = "tenant"
    USER = "user"


class LicenseType(str, Enum):
    """License type enumeration."""

    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"
    UNLIMITED = "unlimited"
    CUSTOM = "custom"


class Organization(BaseModel):
    """Organization domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    slug: str
    description: str | None = None
    status: OrganizationStatus = OrganizationStatus.ACTIVE
    parent_id: UUID | None = None
    settings: dict = Field(default_factory=dict)
    branding: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class Tenant(BaseModel):
    """Tenant domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    slug: str
    organization_id: UUID
    status: TenantStatus = TenantStatus.ACTIVE
    settings: dict = Field(default_factory=dict)
    branding: dict = Field(default_factory=dict)
    storage_limit_gb: int = 10
    ai_token_limit: int = 10000
    notification_limit: int = 1000
    workflow_limit: int = 100
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class Department(BaseModel):
    """Department domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    organization_id: UUID
    parent_id: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class Environment(BaseModel):
    """Environment domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    type: EnvironmentType
    organization_id: UUID
    settings: dict = Field(default_factory=dict)
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class FeatureFlag(BaseModel):
    """Feature flag domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    key: str
    name: str
    description: str | None = None
    scope: FeatureFlagScope = FeatureFlagScope.GLOBAL
    scope_id: UUID | None = None
    enabled: bool = False
    rollout_percentage: int = 0
    dependencies: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class PlatformSetting(BaseModel):
    """Platform setting domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    key: str
    value: str
    category: str
    description: str | None = None
    is_secret: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class License(BaseModel):
    """License domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    organization_id: UUID
    license_type: LicenseType
    license_key: str
    expires_at: datetime | None = None
    max_users: int = 10
    max_tenants: int = 1
    features: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class Quota(BaseModel):
    """Quota domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    tenant_id: UUID
    resource_type: str
    limit_value: int
    current_usage: int = 0
    reset_at: datetime | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class MaintenanceMode(BaseModel):
    """Maintenance mode domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    enabled: bool = False
    message: str | None = None
    scheduled_at: datetime | None = None
    ends_at: datetime | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None