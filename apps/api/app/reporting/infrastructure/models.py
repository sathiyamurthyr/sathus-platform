"""Reporting database models."""

from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    String,
    Text,
    Boolean,
    Integer,
    Float,
    Date,
    func,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID

from app.core.database import Base


class ReportType(str, Enum):
    """Report type enumeration."""

    DASHBOARD = "dashboard"
    OPERATIONAL = "operational"
    EXECUTIVE = "executive"
    CUSTOM = "custom"


class ReportFormat(str, Enum):
    """Report format enumeration."""

    JSON = "json"
    CSV = "csv"
    EXCEL = "excel"
    PDF = "pdf"


class ChartType(str, Enum):
    """Chart type enumeration."""

    BAR = "bar"
    LINE = "line"
    PIE = "pie"
    AREA = "area"
    SCATTER = "scatter"
    HEATMAP = "heatmap"
    GAUGE = "gauge"
    TABLE = "table"
    CARD = "card"
    TREE_MAP = "tree_map"


class ScheduleFrequency(str, Enum):
    """Schedule frequency enumeration."""

    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"
    CRON = "cron"


class ReportSource(str, Enum):
    """Report data source enumeration."""

    IDENTITY = "identity"
    AUTHORIZATION = "authorization"
    CONTENT = "content"
    MEDIA = "media"
    NOTIFICATION = "notification"
    WORKFLOW = "workflow"
    SEARCH = "search"
    AUDIT = "audit"
    ADMINISTRATION = "administration"


class ReportStatus(str, Enum):
    """Report status enumeration."""

    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"


class Report(Base):
    """Report database model."""

    __tablename__ = "reports"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    report_type = Column(SQLEnum(ReportType), nullable=False)
    source = Column(SQLEnum(ReportSource), nullable=False)
    query_config = Column(Text, nullable=False, default="{}")  # JSON
    parameters = Column(Text, nullable=False, default="{}")  # JSON
    chart_config = Column(Text, nullable=False, default="{}")  # JSON
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    is_public = Column(Boolean, nullable=False, default=False)
    status = Column(SQLEnum(ReportStatus), nullable=False, default=ReportStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Dashboard(Base):
    """Dashboard database model."""

    __tablename__ = "dashboards"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    layout_config = Column(Text, nullable=False, default="{}")  # JSON
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    is_public = Column(Boolean, nullable=False, default=False)
    status = Column(SQLEnum(ReportStatus), nullable=False, default=ReportStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Widget(Base):
    """Widget database model."""

    __tablename__ = "widgets"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    dashboard_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("dashboards.id"),
        nullable=False,
    )
    report_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("reports.id"),
        nullable=True,
    )
    chart_type = Column(SQLEnum(ChartType), nullable=False)
    title = Column(String(255), nullable=False)
    position_x = Column(Integer, nullable=False, default=0)
    position_y = Column(Integer, nullable=False, default=0)
    width = Column(Integer, nullable=False, default=4)
    height = Column(Integer, nullable=False, default=4)
    config = Column(Text, nullable=False, default="{}")  # JSON
    data_source = Column(SQLEnum(ReportSource), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class KPI(Base):
    """KPI database model."""

    __tablename__ = "kpis"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    source = Column(SQLEnum(ReportSource), nullable=False)
    metric_query = Column(Text, nullable=False)
    target_value = Column(Float, nullable=True)
    current_value = Column(Float, nullable=True)
    unit = Column(String(50), nullable=True)
    frequency = Column(SQLEnum(ScheduleFrequency), nullable=False, default=ScheduleFrequency.DAILY)
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    tenant_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True,
    )
    is_public = Column(Boolean, nullable=False, default=False)
    status = Column(SQLEnum(ReportStatus), nullable=False, default=ReportStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ReportSchedule(Base):
    """Report schedule database model."""

    __tablename__ = "report_schedules"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    report_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("reports.id"),
        nullable=False,
    )
    frequency = Column(SQLEnum(ScheduleFrequency), nullable=False)
    cron_expression = Column(String(100), nullable=True)
    email_recipients = Column(Text, nullable=False, default="[]")  # JSON array
    notification_recipients = Column(Text, nullable=False, default="[]")  # JSON array
    timezone = Column(String(50), nullable=False, default="UTC")
    next_run = Column(DateTime(timezone=True), nullable=True)
    last_run = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ReportExecution(Base):
    """Report execution database model."""

    __tablename__ = "report_executions"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    report_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("reports.id"),
        nullable=False,
    )
    executed_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    parameters = Column(Text, nullable=False, default="{}")  # JSON
    format = Column(SQLEnum(ReportFormat), nullable=False)
    file_path = Column(String(500), nullable=True)
    status = Column(String(50), nullable=False, default="pending")
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)