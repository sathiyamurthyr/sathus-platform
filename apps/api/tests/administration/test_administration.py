"""Administration tests."""

import pytest
from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.administration.domain.models import (
    OrganizationStatus,
    TenantStatus,
    EnvironmentType,
    FeatureFlagScope,
    LicenseType,
    Organization,
    Tenant,
    Department,
    Environment,
    FeatureFlag,
    PlatformSetting,
    License,
    Quota,
    MaintenanceMode,
)


# Enum Tests
class TestOrganizationStatus:
    """Test OrganizationStatus enum."""

    def test_organization_status_values(self):
        """Test organization status enum values."""
        assert OrganizationStatus.ACTIVE == "active"
        assert OrganizationStatus.INACTIVE == "inactive"
        assert OrganizationStatus.SUSPENDED == "suspended"
        assert OrganizationStatus.ARCHIVED == "archived"


class TestTenantStatus:
    """Test TenantStatus enum."""

    def test_tenant_status_values(self):
        """Test tenant status enum values."""
        assert TenantStatus.ACTIVE == "active"
        assert TenantStatus.INACTIVE == "inactive"
        assert TenantStatus.SUSPENDED == "suspended"
        assert TenantStatus.PENDING == "pending"


class TestEnvironmentType:
    """Test EnvironmentType enum."""

    def test_environment_type_values(self):
        """Test environment type enum values."""
        assert EnvironmentType.DEVELOPMENT == "development"
        assert EnvironmentType.STAGING == "staging"
        assert EnvironmentType.PRODUCTION == "production"


class TestFeatureFlagScope:
    """Test FeatureFlagScope enum."""

    def test_feature_flag_scope_values(self):
        """Test feature flag scope enum values."""
        assert FeatureFlagScope.GLOBAL == "global"
        assert FeatureFlagScope.TENANT == "tenant"
        assert FeatureFlagScope.USER == "user"


class TestLicenseType:
    """Test LicenseType enum."""

    def test_license_type_values(self):
        """Test license type enum values."""
        assert LicenseType.FREE == "free"
        assert LicenseType.STARTER == "starter"
        assert LicenseType.PROFESSIONAL == "professional"
        assert LicenseType.ENTERPRISE == "enterprise"
        assert LicenseType.UNLIMITED == "unlimited"
        assert LicenseType.CUSTOM == "custom"


# Domain Model Tests
class TestOrganization:
    """Test Organization domain model."""

    def test_create_organization(self):
        """Test creating an organization."""
        org = Organization(
            id=uuid4(),
            name="Acme Corp",
            slug="acme-corp",
            description="A test organization",
            created_at=datetime.now(timezone.utc),
        )

        assert org.name == "Acme Corp"
        assert org.slug == "acme-corp"
        assert org.status == OrganizationStatus.ACTIVE
        assert org.settings == {}
        assert org.branding == {}

    def test_organization_frozen(self):
        """Test that organization is frozen (immutable)."""
        org = Organization(
            id=uuid4(),
            name="Test Org",
            slug="test-org",
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            org.name = "Updated Org"


class TestTenant:
    """Test Tenant domain model."""

    def test_create_tenant(self):
        """Test creating a tenant."""
        tenant = Tenant(
            id=uuid4(),
            name="Acme Production",
            slug="acme-prod",
            organization_id=uuid4(),
            created_at=datetime.now(timezone.utc),
        )

        assert tenant.name == "Acme Production"
        assert tenant.status == TenantStatus.ACTIVE
        assert tenant.storage_limit_gb == 10
        assert tenant.ai_token_limit == 10000

    def test_tenant_frozen(self):
        """Test that tenant is frozen (immutable)."""
        tenant = Tenant(
            id=uuid4(),
            name="Test Tenant",
            slug="test-tenant",
            organization_id=uuid4(),
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            tenant.name = "Updated Tenant"


class TestFeatureFlag:
    """Test FeatureFlag domain model."""

    def test_create_feature_flag(self):
        """Test creating a feature flag."""
        flag = FeatureFlag(
            id=uuid4(),
            key="new-feature",
            name="New Feature",
            created_at=datetime.now(timezone.utc),
        )

        assert flag.key == "new-feature"
        assert flag.scope == FeatureFlagScope.GLOBAL
        assert flag.enabled is False
        assert flag.rollout_percentage == 0

    def test_feature_flag_frozen(self):
        """Test that feature flag is frozen (immutable)."""
        flag = FeatureFlag(
            id=uuid4(),
            key="test-flag",
            name="Test Flag",
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            flag.key = "updated-flag"


class TestLicense:
    """Test License domain model."""

    def test_create_license(self):
        """Test creating a license."""
        license = License(
            id=uuid4(),
            organization_id=uuid4(),
            license_type=LicenseType.ENTERPRISE,
            license_key="test-license-key",
            created_at=datetime.now(timezone.utc),
        )

        assert license.license_type == LicenseType.ENTERPRISE
        assert license.max_users == 10
        assert license.max_tenants == 1

    def test_license_frozen(self):
        """Test that license is frozen (immutable)."""
        license = License(
            id=uuid4(),
            organization_id=uuid4(),
            license_type=LicenseType.STARTER,
            license_key="test-key",
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            license.license_key = "updated-key"


class TestMaintenanceMode:
    """Test MaintenanceMode domain model."""

    def test_create_maintenance_mode(self):
        """Test creating maintenance mode."""
        mode = MaintenanceMode(
            id=uuid4(),
            enabled=True,
            message="System maintenance",
            created_at=datetime.now(timezone.utc),
        )

        assert mode.enabled is True
        assert mode.message == "System maintenance"

    def test_maintenance_mode_frozen(self):
        """Test that maintenance mode is frozen (immutable)."""
        mode = MaintenanceMode(
            id=uuid4(),
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            mode.enabled = True