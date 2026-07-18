"""Authorization database models."""

from enum import StrEnum
from uuid import UUID

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    String,
    Table,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import relationship

from app.core.database import Base


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


class Permission(Base):
    """Permission database model."""

    __tablename__ = "permissions"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    resource = Column(String(100), nullable=False)
    action = Column(SQLEnum(PermissionAction), nullable=False)
    description = Column(String(500), nullable=True)
    group = Column(String(100), nullable=True)
    is_system = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    roles = relationship("Role", secondary="role_permissions", back_populates="permissions")


class Role(Base):
    """Role database model."""

    __tablename__ = "roles"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    is_system = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    permissions = relationship("Permission", secondary="role_permissions", back_populates="roles")


# Association tables
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", PostgresUUID(as_uuid=True), ForeignKey("roles.id"), primary_key=True),
    Column("permission_id", PostgresUUID(as_uuid=True), ForeignKey("permissions.id"), primary_key=True),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)

user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", PostgresUUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
    Column("role_id", PostgresUUID(as_uuid=True), ForeignKey("roles.id"), primary_key=True),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)


class PermissionGroup(Base):
    """Permission group database model."""

    __tablename__ = "permission_groups"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AuthorizationPolicy(Base):
    """Authorization policy database model."""

    __tablename__ = "authorization_policies"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    permission_required = Column(String(255), nullable=False)
    resource_type = Column(String(100), nullable=True)
    conditions = Column(String, nullable=True)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PermissionAssignment(Base):
    """Direct permission assignment to user."""

    __tablename__ = "permission_assignments"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    user_id = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    permission_id = Column(
        PostgresUUID(as_uuid=True), ForeignKey("permissions.id"), nullable=False
    )
    granted_by = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])
    permission = relationship("Permission")
    granted_by_user = relationship("User", foreign_keys=[granted_by])