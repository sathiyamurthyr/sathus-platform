"""Reporting domain models."""

from datetime import datetime, date
from enum import Enum
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field


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


class Report(BaseModel):
    """Report domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    description: str | None = None
    report_type: ReportType
    source: ReportSource
    query_config: dict = Field(default_factory=dict)
    parameters: dict = Field(default_factory=dict)
    chart_config: dict = Field(default_factory=dict)
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    is_public: bool = False
    status: ReportStatus = ReportStatus.DRAFT
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class Dashboard(BaseModel):
    """Dashboard domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    description: str | None = None
    layout_config: dict = Field(default_factory=dict)
    widgets: list[dict] = Field(default_factory=list)
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    is_public: bool = False
    status: ReportStatus = ReportStatus.DRAFT
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class Widget(BaseModel):
    """Widget domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    dashboard_id: UUID
    report_id: UUID | None = None
    chart_type: ChartType
    title: str
    position_x: int = 0
    position_y: int = 0
    width: int = 4
    height: int = 4
    config: dict = Field(default_factory=dict)
    data_source: ReportSource | None = None


class KPI(BaseModel):
    """KPI domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    name: str
    description: str | None = None
    source: ReportSource
    metric_query: str
    target_value: float | None = None
    current_value: float | None = None
    unit: str | None = None
    frequency: ScheduleFrequency = ScheduleFrequency.DAILY
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    is_public: bool = False
    status: ReportStatus = ReportStatus.ACTIVE
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class ReportSchedule(BaseModel):
    """Report schedule domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    report_id: UUID
    frequency: ScheduleFrequency
    cron_expression: str | None = None
    email_recipients: list[str] = Field(default_factory=list)
    notification_recipients: list[UUID] = Field(default_factory=list)
    timezone: str = "UTC"
    next_run: datetime | None = None
    last_run: datetime | None = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class ReportExecution(BaseModel):
    """Report execution domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    report_id: UUID
    executed_by: UUID | None = None
    parameters: dict = Field(default_factory=dict)
    format: ReportFormat
    file_path: str | None = None
    status: str = "pending"
    error_message: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    completed_at: datetime | None = None


class ReportQuery(BaseModel):
    """Report query value object."""

    model_config = ConfigDict(frozen=True)

    source: ReportSource
    start_date: date | None = None
    end_date: date | None = None
    group_by: str | None = None
    aggregations: list[str] = Field(default_factory=list)
    filters: dict = Field(default_factory=dict)
    limit: int = 100
    offset: int = 0