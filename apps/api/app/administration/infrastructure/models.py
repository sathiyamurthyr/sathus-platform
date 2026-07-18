"""Administration database models."""

from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    String,
    Text,
    Boolean,
    Integer,
    func,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID

from app.core.database import Base


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


class Organization(Base):
    """Organization database model."""

    __tablename__ = "organizations"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    slug = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(OrganizationStatus), nullable=False, default=OrganizationStatus.ACTIVE)
    parent_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    settings = Column(Text, nullable=False, default="{}")
    branding = Column(Text, nullable=False, default="{}")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Tenant(Base):
    """Tenant database model."""

    __tablename__ = "tenants"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    slug = Column(String(100), nullable=False, unique=True)
    organization_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False,
    )
    status = Column(SQLEnum(TenantStatus), nullable=False, default=TenantStatus.ACTIVE)
    settings = Column(Text, nullable=False, default="{}")
    branding = Column(Text, nullable=False, default="{}")
    storage_limit_gb = Column(Integer, nullable=False, default=10)
    ai_token_limit = Column(Integer, nullable=False, default=10000)
    notification_limit = Column(Integer, nullable=False, default=1000)
    workflow_limit = Column(Integer, nullable=False, default=100)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Department(Base):
    """Department database model."""

    __tablename__ = "departments"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    organization_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False,
    )
    parent_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("departments.id"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Environment(Base):
    """Environment database model."""

    __tablename__ = "environments"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    type = Column(SQLEnum(EnvironmentType), nullable=False)
    organization_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False,
    )
    settings = Column(Text, nullable=False, default="{}")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class FeatureFlag(Base):
    """Feature flag database model."""

    __tablename__ = "feature_flags"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    key = Column(String(255), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    scope = Column(SQLEnum(FeatureFlagScope), nullable=False, default=FeatureFlagScope.GLOBAL)
    scope_id = Column(PostgresUUID(as_uuid=True), nullable=True)
    enabled = Column(Boolean, nullable=False, default=False)
    rollout_percentage = Column(Integer, nullable=False, default=0)
    dependencies = Column(Text, nullable=False, default="[]")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PlatformSetting(Base):
    """Platform setting database model."""

    __tablename__ = "platform_settings"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    key = Column(String(255), nullable=False, unique=True)
    value = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    is_secret = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class License(Base):
    """License database model."""

    __tablename__ = "licenses"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    organization_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False,
    )
    license_type = Column(SQLEnum(LicenseType), nullable=False)
    license_key = Column(String(500), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    max_users = Column(Integer, nullable=False, default=10)
    max_tenants = Column(Integer, nullable=False, default=1)
    features = Column(Text, nullable=False, default="[]")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Quota(Base):
    """Quota database model."""

    __tablename__ = "quotas"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("tenants.id"),
        nullable=False,
    )
    resource_type = Column(String(100), nullable=False)
    limit_value = Column(Integer, nullable=False)
    current_usage = Column(Integer, nullable=False, default=0)
    reset_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class MaintenanceMode(Base):
    """Maintenance mode database model."""

    __tablename__ = "maintenance_mode"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    enabled = Column(Boolean, nullable=False, default=False)
    message = Column(Text, nullable=True)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    ends_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())