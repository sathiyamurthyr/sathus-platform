"""Reporting API schemas."""

from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel, Field

from app.reporting.domain.models import (
    ReportType,
    ReportFormat,
    ChartType,
    ScheduleFrequency,
    ReportSource,
    ReportStatus,
)


class ReportResponse(BaseModel):
    """Report response schema."""

    id: UUID
    name: str
    description: str | None = None
    report_type: str
    source: str
    query_config: dict
    parameters: dict
    chart_config: dict
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    is_public: bool
    status: str
    created_at: datetime
    updated_at: datetime | None = None


class ReportCreate(BaseModel):
    """Report create schema."""

    name: str
    description: str | None = None
    report_type: ReportType
    source: ReportSource
    query_config: dict = Field(default_factory=dict)
    parameters: dict = Field(default_factory=dict)
    chart_config: dict = Field(default_factory=dict)
    is_public: bool = False


class ReportUpdate(BaseModel):
    """Report update schema."""

    name: str | None = None
    description: str | None = None
    query_config: dict | None = None
    parameters: dict | None = None
    chart_config: dict | None = None
    is_public: bool | None = None
    status: ReportStatus | None = None


class ReportSearchResponse(BaseModel):
    """Report search response schema."""

    reports: list[ReportResponse]
    total: int
    limit: int
    offset: int


class DashboardResponse(BaseModel):
    """Dashboard response schema."""

    id: UUID
    name: str
    description: str | None = None
    layout_config: dict
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    is_public: bool
    status: str
    created_at: datetime
    updated_at: datetime | None = None


class DashboardCreate(BaseModel):
    """Dashboard create schema."""

    name: str
    description: str | None = None
    layout_config: dict = Field(default_factory=dict)
    is_public: bool = False


class DashboardUpdate(BaseModel):
    """Dashboard update schema."""

    name: str | None = None
    description: str | None = None
    layout_config: dict | None = None
    is_public: bool | None = None
    status: ReportStatus | None = None


class WidgetResponse(BaseModel):
    """Widget response schema."""

    id: UUID
    dashboard_id: UUID
    report_id: UUID | None = None
    chart_type: str
    title: str
    position_x: int
    position_y: int
    width: int
    height: int
    config: dict
    data_source: str | None = None
    created_at: datetime


class WidgetCreate(BaseModel):
    """Widget create schema."""

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


class WidgetUpdate(BaseModel):
    """Widget update schema."""

    title: str | None = None
    position_x: int | None = None
    position_y: int | None = None
    width: int | None = None
    height: int | None = None
    config: dict | None = None


class KPIResponse(BaseModel):
    """KPI response schema."""

    id: UUID
    name: str
    description: str | None = None
    source: str
    metric_query: str
    target_value: float | None = None
    current_value: float | None = None
    unit: str | None = None
    frequency: str
    created_by: UUID | None = None
    tenant_id: UUID | None = None
    is_public: bool
    status: str
    created_at: datetime
    updated_at: datetime | None = None


class KPICreate(BaseModel):
    """KPI create schema."""

    name: str
    description: str | None = None
    source: ReportSource
    metric_query: str
    target_value: float | None = None
    current_value: float | None = None
    unit: str | None = None
    frequency: ScheduleFrequency = ScheduleFrequency.DAILY
    is_public: bool = False


class KPIUpdate(BaseModel):
    """KPI update schema."""

    name: str | None = None
    description: str | None = None
    target_value: float | None = None
    current_value: float | None = None
    is_public: bool | None = None
    status: ReportStatus | None = None


class KPISearchResponse(BaseModel):
    """KPI search response schema."""

    kpis: list[KPIResponse]
    total: int
    limit: int
    offset: int


class ReportScheduleResponse(BaseModel):
    """Report schedule response schema."""

    id: UUID
    report_id: UUID
    frequency: str
    cron_expression: str | None = None
    email_recipients: list[str]
    notification_recipients: list[UUID]
    timezone: str
    next_run: datetime | None = None
    last_run: datetime | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime | None = None


class ReportScheduleCreate(BaseModel):
    """Report schedule create schema."""

    report_id: UUID
    frequency: ScheduleFrequency
    cron_expression: str | None = None
    email_recipients: list[str] = Field(default_factory=list)
    notification_recipients: list[UUID] = Field(default_factory=list)
    timezone: str = "UTC"


class ReportExecutionResponse(BaseModel):
    """Report execution response schema."""

    id: UUID
    report_id: UUID
    executed_by: UUID | None = None
    parameters: dict
    format: str
    file_path: str | None = None
    status: str
    error_message: str | None = None
    created_at: datetime
    completed_at: datetime | None = None


class ReportExecutionCreate(BaseModel):
    """Report execution create schema."""

    report_id: UUID
    format: ReportFormat
    parameters: dict = Field(default_factory=dict)