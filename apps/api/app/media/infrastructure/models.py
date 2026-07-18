"""Media infrastructure models."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.media.domain.models import AssetType, AssetStatus, StorageProvider


class Asset(Base):
    """SQLAlchemy Asset model."""

    __tablename__ = "assets"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    asset_type = Column(Enum(AssetType), nullable=False)
    status = Column(Enum(AssetStatus), nullable=False, default=AssetStatus.UPLOADING)
    storage_provider = Column(Enum(StorageProvider), nullable=False, default=StorageProvider.LOCAL)
    storage_path = Column(Text, nullable=False)
    metadata_width = Column(Integer, nullable=True)
    metadata_height = Column(Integer, nullable=True)
    metadata_duration = Column(Integer, nullable=True)
    metadata_checksum = Column(String(64), nullable=True)
    metadata_exif = Column(Text, nullable=True)
    metadata_color_profile = Column(String(50), nullable=True)
    folder_id = Column(PostgresUUID(as_uuid=True), ForeignKey("folders.id"), nullable=True)
    created_by = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    folder = relationship("Folder", back_populates="assets")
    versions = relationship("AssetVersion", back_populates="asset", cascade="all, delete-orphan")
    thumbnails = relationship("Thumbnail", back_populates="asset", cascade="all, delete-orphan")
    transformations = relationship("Transformation", back_populates="asset", cascade="all, delete-orphan")


class AssetVersion(Base):
    """SQLAlchemy AssetVersion model."""

    __tablename__ = "asset_versions"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    asset_id = Column(PostgresUUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    filename = Column(String(255), nullable=False)
    storage_path = Column(Text, nullable=False)
    file_size = Column(Integer, nullable=False)
    checksum = Column(String(64), nullable=False)
    created_by = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    asset = relationship("Asset", back_populates="versions")


class Folder(Base):
    """SQLAlchemy Folder model."""

    __tablename__ = "folders"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    parent_id = Column(PostgresUUID(as_uuid=True), ForeignKey("folders.id"), nullable=True)
    path = Column(Text, nullable=False)
    created_by = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    assets = relationship("Asset", back_populates="folder")


class Collection(Base):
    """SQLAlchemy Collection model."""

    __tablename__ = "collections"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    is_smart = Column(Boolean, nullable=False, default=False)
    query = Column(Text, nullable=True)
    created_by = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)


class AssetTag(Base):
    """SQLAlchemy AssetTag model."""

    __tablename__ = "asset_tags"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(100), nullable=False)
    slug = Column(String(100), nullable=False, unique=True)
    created_by = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AssetRelation(Base):
    """SQLAlchemy AssetRelation model."""

    __tablename__ = "asset_relations"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    source_asset_id = Column(PostgresUUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)
    target_asset_id = Column(PostgresUUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)
    relation_type = Column(String(50), nullable=False)
    created_by = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Thumbnail(Base):
    """SQLAlchemy Thumbnail model."""

    __tablename__ = "thumbnails"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    asset_id = Column(PostgresUUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)
    size = Column(String(20), nullable=False)
    storage_path = Column(Text, nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    file_size = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    asset = relationship("Asset", back_populates="thumbnails")


class Transformation(Base):
    """SQLAlchemy Transformation model."""

    __tablename__ = "transformations"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    asset_id = Column(PostgresUUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)
    operation = Column(String(50), nullable=False)
    parameters = Column(Text, nullable=False)
    storage_path = Column(Text, nullable=False)
    file_size = Column(Integer, nullable=False)
    created_by = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    asset = relationship("Asset", back_populates="transformations")


class UploadSession(Base):
    """SQLAlchemy UploadSession model."""

    __tablename__ = "upload_sessions"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    total_chunks = Column(Integer, nullable=False)
    uploaded_chunks = Column(Integer, nullable=False, default=0)
    status = Column(Enum(AssetStatus), nullable=False, default=AssetStatus.UPLOADING)
    created_by = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)