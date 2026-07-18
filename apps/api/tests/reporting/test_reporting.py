"""Reporting module tests."""

import pytest
from datetime import datetime, timezone, date
from uuid import UUID, uuid4

from app.reporting.domain.models import (
    ReportType,
    ReportFormat,
    ChartType,
    ScheduleFrequency,
    ReportSource,
    ReportStatus,
    Report,
    Dashboard,
    Widget,
    KPI,
    ReportSchedule,
    ReportExecution,
    ReportQuery,
)


# Enum Tests
class TestReportType:
    """Test ReportType enum."""

    def test_report_type_values(self):
        """Test report type enum values."""
        assert ReportType.DASHBOARD == "dashboard"
        assert ReportType.OPERATIONAL == "operational"
        assert ReportType.EXECUTIVE == "executive"
        assert ReportType.CUSTOM == "custom"


class TestReportFormat:
    """Test ReportFormat enum."""

    def test_report_format_values(self):
        """Test report format enum values."""
        assert ReportFormat.JSON == "json"
        assert ReportFormat.CSV == "csv"
        assert ReportFormat.EXCEL == "excel"
        assert ReportFormat.PDF == "pdf"


class TestChartType:
    """Test ChartType enum."""

    def test_chart_type_values(self):
        """Test chart type enum values."""
        assert ChartType.BAR == "bar"
        assert ChartType.LINE == "line"
        assert ChartType.PIE == "pie"
        assert ChartType.AREA == "area"
        assert ChartType.SCATTER == "scatter"
        assert ChartType.HEATMAP == "heatmap"
        assert ChartType.GAUGE == "gauge"
        assert ChartType.TABLE == "table"
        assert ChartType.CARD == "card"
        assert ChartType.TREE_MAP == "tree_map"


class TestScheduleFrequency:
    """Test ScheduleFrequency enum."""

    def test_schedule_frequency_values(self):
        """Test schedule frequency enum values."""
        assert ScheduleFrequency.DAILY == "daily"
        assert ScheduleFrequency.WEEKLY == "weekly"
        assert ScheduleFrequency.MONTHLY == "monthly"
        assert ScheduleFrequency.QUARTERLY == "quarterly"
        assert ScheduleFrequency.YEARLY == "yearly"
        assert ScheduleFrequency.CRON == "cron"


class TestReportSource:
    """Test ReportSource enum."""

    def test_report_source_values(self):
        """Test report source enum values."""
        assert ReportSource.IDENTITY == "identity"
        assert ReportSource.AUTHORIZATION == "authorization"
        assert ReportSource.CONTENT == "content"
        assert ReportSource.MEDIA == "media"
        assert ReportSource.NOTIFICATION == "notification"
        assert ReportSource.WORKFLOW == "workflow"
        assert ReportSource.SEARCH == "search"
        assert ReportSource.AUDIT == "audit"
        assert ReportSource.ADMINISTRATION == "administration"


class TestReportStatus:
    """Test ReportStatus enum."""

    def test_report_status_values(self):
        """Test report status enum values."""
        assert ReportStatus.DRAFT == "draft"
        assert ReportStatus.ACTIVE == "active"
        assert ReportStatus.INACTIVE == "inactive"
        assert ReportStatus.ARCHIVED == "archived"


# Domain Model Tests
class TestReport:
    """Test Report model."""

    def test_create_report(self):
        """Test creating a report."""
        report = Report(
            id=uuid4(),
            name="User Activity Report",
            description="Monthly user activity summary",
            report_type=ReportType.OPERATIONAL,
            source=ReportSource.IDENTITY,
            query_config={"table": "users", "metrics": ["count"]},
            parameters={"start_date": "2024-01-01"},
            chart_config={"type": "bar"},
            created_by=uuid4(),
            tenant_id=uuid4(),
            is_public=True,
            status=ReportStatus.ACTIVE,
            created_at=datetime.now(timezone.utc),
        )

        assert report.name == "User Activity Report"
        assert report.report_type == ReportType.OPERATIONAL
        assert report.source == ReportSource.IDENTITY
        assert report.is_public is True
        assert report.status == ReportStatus.ACTIVE

    def test_report_frozen(self):
        """Test that report is frozen (immutable)."""
        report = Report(
            id=uuid4(),
            name="Test Report",
            report_type=ReportType.EXECUTIVE,
            source=ReportSource.WORKFLOW,
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            report.name = "Updated Report"


class TestDashboard:
    """Test Dashboard model."""

    def test_create_dashboard(self):
        """Test creating a dashboard."""
        dashboard = Dashboard(
            id=uuid4(),
            name="Executive Dashboard",
            description="C-level metrics overview",
            layout_config={"columns": 12, "rows": 8},
            created_by=uuid4(),
            tenant_id=uuid4(),
            is_public=False,
            status=ReportStatus.ACTIVE,
            created_at=datetime.now(timezone.utc),
        )

        assert dashboard.name == "Executive Dashboard"
        assert dashboard.layout_config == {"columns": 12, "rows": 8}


class TestWidget:
    """Test Widget model."""

    def test_create_widget(self):
        """Test creating a widget."""
        widget = Widget(
            id=uuid4(),
            dashboard_id=uuid4(),
            chart_type=ChartType.BAR,
            title="User Growth",
            position_x=0,
            position_y=0,
            width=4,
            height=4,
            config={"color": "blue"},
            data_source=ReportSource.IDENTITY,
            created_at=datetime.now(timezone.utc),
        )

        assert widget.title == "User Growth"
        assert widget.chart_type == ChartType.BAR
        assert widget.width == 4
        assert widget.height == 4


class TestKPI:
    """Test KPI model."""

    def test_create_kpi(self):
        """Test creating a KPI."""
        kpi = KPI(
            id=uuid4(),
            name="Active Users",
            description="Number of active users",
            source=ReportSource.IDENTITY,
            metric_query="SELECT COUNT(*) FROM users WHERE active = true",
            target_value=10000.0,
            current_value=8500.0,
            unit="users",
            frequency=ScheduleFrequency.DAILY,
            created_by=uuid4(),
            tenant_id=uuid4(),
            is_public=True,
            status=ReportStatus.ACTIVE,
            created_at=datetime.now(timezone.utc),
        )

        assert kpi.name == "Active Users"
        assert kpi.target_value == 10000.0
        assert kpi.current_value == 8500.0
        assert kpi.unit == "users"


class TestReportSchedule:
    """Test ReportSchedule model."""

    def test_create_report_schedule(self):
        """Test creating a report schedule."""
        schedule = ReportSchedule(
            id=uuid4(),
            report_id=uuid4(),
            frequency=ScheduleFrequency.WEEKLY,
            cron_expression="0 0 * * 1",
            email_recipients=["admin@example.com"],
            notification_recipients=[uuid4()],
            timezone="UTC",
            next_run=datetime.now(timezone.utc),
            is_active=True,
            created_at=datetime.now(timezone.utc),
        )

        assert schedule.frequency == ScheduleFrequency.WEEKLY
        assert schedule.cron_expression == "0 0 * * 1"
        assert schedule.is_active is True


class TestReportExecution:
    """Test ReportExecution model."""

    def test_create_report_execution(self):
        """Test creating a report execution."""
        execution = ReportExecution(
            id=uuid4(),
            report_id=uuid4(),
            executed_by=uuid4(),
            parameters={"start_date": "2024-01-01"},
            format=ReportFormat.PDF,
            file_path="/exports/report-123.pdf",
            status="completed",
            created_at=datetime.now(timezone.utc),
            completed_at=datetime.now(timezone.utc),
        )

        assert execution.format == ReportFormat.PDF
        assert execution.status == "completed"


class TestReportQuery:
    """Test ReportQuery value object."""

    def test_create_report_query(self):
        """Test creating a report query."""
        query = ReportQuery(
            source=ReportSource.WORKFLOW,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            group_by="month",
            aggregations=["count", "sum"],
            filters={"status": "completed"},
            limit=100,
            offset=0,
        )

        assert query.source == ReportSource.WORKFLOW
        assert query.group_by == "month"
        assert query.aggregations == ["count", "sum"]
        assert query.limit == 100