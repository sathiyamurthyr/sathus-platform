"""Reporting application services."""

from datetime import datetime, date
from uuid import UUID

from app.reporting.domain.models import (
    Report,
    Dashboard,
    Widget,
    KPI,
    ReportSchedule,
    ReportExecution,
    ReportType,
    ReportFormat,
    ChartType,
    ScheduleFrequency,
    ReportSource,
    ReportStatus,
    ReportQuery,
)
from app.reporting.infrastructure.models import (
    Report as ReportModel,
    Dashboard as DashboardModel,
    Widget as WidgetModel,
    KPI as KPIModel,
    ReportSchedule as ReportScheduleModel,
    ReportExecution as ReportExecutionModel,
    ReportType as ReportTypeModel,
    ReportFormat as ReportFormatModel,
    ChartType as ChartTypeModel,
    ScheduleFrequency as ScheduleFrequencyModel,
    ReportSource as ReportSourceModel,
    ReportStatus as ReportStatusModel,
)
from app.reporting.infrastructure.repositories import (
    ReportRepository,
    DashboardRepository,
    WidgetRepository,
    KPIRepository,
    ReportScheduleRepository,
    ReportExecutionRepository,
)
from app.core.logging import logger


class ReportService:
    """Report service."""

    def __init__(self, report_repo: ReportRepository):
        """Initialize service."""
        self.report_repo = report_repo

    async def create_report(
        self,
        name: str,
        report_type: ReportType,
        source: ReportSource,
        query_config: dict,
        parameters: dict,
        chart_config: dict,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool = False,
    ) -> Report:
        """Create a report."""
        report = await self.report_repo.create(
            name=name,
            report_type=ReportTypeModel(report_type.value),
            source=ReportSourceModel(source.value),
            query_config=query_config,
            parameters=parameters,
            chart_config=chart_config,
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
        )

        logger.info(f"Report created: {report.id}")

        return Report(
            id=report.id,
            name=report.name,
            description=report.description,
            report_type=report_type,
            source=source,
            query_config=report.query_config,
            parameters=report.parameters,
            chart_config=report.chart_config,
            created_by=report.created_by,
            tenant_id=report.tenant_id,
            is_public=report.is_public,
            status=ReportStatus(report.status.value),
            created_at=report.created_at,
            updated_at=report.updated_at,
        )

    async def get_report(self, report_id: UUID) -> Report | None:
        """Get a report by ID."""
        report = await self.report_repo.get_by_id(report_id)
        if not report:
            return None

        return Report(
            id=report.id,
            name=report.name,
            description=report.description,
            report_type=ReportType(report.report_type.value),
            source=ReportSource(report.source.value),
            query_config=report.query_config,
            parameters=report.parameters,
            chart_config=report.chart_config,
            created_by=report.created_by,
            tenant_id=report.tenant_id,
            is_public=report.is_public,
            status=ReportStatus(report.status.value),
            created_at=report.created_at,
            updated_at=report.updated_at,
        )

    async def search_reports(
        self,
        report_type: ReportType | None = None,
        source: ReportSource | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool | None = None,
        status: ReportStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[Report], int]:
        """Search reports."""
        reports, total = await self.report_repo.search(
            report_type=ReportTypeModel(report_type.value) if report_type else None,
            source=ReportSourceModel(source.value) if source else None,
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
            status=ReportStatusModel(status.value) if status else None,
            limit=limit,
            offset=offset,
        )

        return [
            Report(
                id=r.id,
                name=r.name,
                description=r.description,
                report_type=ReportType(r.report_type.value),
                source=ReportSource(r.source.value),
                query_config=r.query_config,
                parameters=r.parameters,
                chart_config=r.chart_config,
                created_by=r.created_by,
                tenant_id=r.tenant_id,
                is_public=r.is_public,
                status=ReportStatus(r.status.value),
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
            for r in reports
        ], total


class DashboardService:
    """Dashboard service."""

    def __init__(self, dashboard_repo: DashboardRepository):
        """Initialize service."""
        self.dashboard_repo = dashboard_repo

    async def create_dashboard(
        self,
        name: str,
        layout_config: dict,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool = False,
    ) -> Dashboard:
        """Create a dashboard."""
        dashboard = await self.dashboard_repo.create(
            name=name,
            layout_config=layout_config,
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
        )

        logger.info(f"Dashboard created: {dashboard.id}")

        return Dashboard(
            id=dashboard.id,
            name=dashboard.name,
            description=dashboard.description,
            layout_config=dashboard.layout_config,
            created_by=dashboard.created_by,
            tenant_id=dashboard.tenant_id,
            is_public=dashboard.is_public,
            status=ReportStatus(dashboard.status.value),
            created_at=dashboard.created_at,
            updated_at=dashboard.updated_at,
        )

    async def get_dashboard(self, dashboard_id: UUID) -> Dashboard | None:
        """Get a dashboard by ID."""
        dashboard = await self.dashboard_repo.get_by_id(dashboard_id)
        if not dashboard:
            return None

        return Dashboard(
            id=dashboard.id,
            name=dashboard.name,
            description=dashboard.description,
            layout_config=dashboard.layout_config,
            created_by=dashboard.created_by,
            tenant_id=dashboard.tenant_id,
            is_public=dashboard.is_public,
            status=ReportStatus(dashboard.status.value),
            created_at=dashboard.created_at,
            updated_at=dashboard.updated_at,
        )

    async def search_dashboards(
        self,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool | None = None,
        status: ReportStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[Dashboard], int]:
        """Search dashboards."""
        dashboards, total = await self.dashboard_repo.search(
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
            status=ReportStatusModel(status.value) if status else None,
            limit=limit,
            offset=offset,
        )

        return [
            Dashboard(
                id=d.id,
                name=d.name,
                description=d.description,
                layout_config=d.layout_config,
                created_by=d.created_by,
                tenant_id=d.tenant_id,
                is_public=d.is_public,
                status=ReportStatus(d.status.value),
                created_at=d.created_at,
                updated_at=d.updated_at,
            )
            for d in dashboards
        ], total


class KPIService:
    """KPI service."""

    def __init__(self, kpi_repo: KPIRepository):
        """Initialize service."""
        self.kpi_repo = kpi_repo

    async def create_kpi(
        self,
        name: str,
        source: ReportSource,
        metric_query: str,
        target_value: float | None = None,
        current_value: float | None = None,
        unit: str | None = None,
        frequency: ScheduleFrequency = ScheduleFrequency.DAILY,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool = False,
    ) -> KPI:
        """Create a KPI."""
        kpi = await self.kpi_repo.create(
            name=name,
            source=ReportSourceModel(source.value),
            metric_query=metric_query,
            target_value=target_value,
            current_value=current_value,
            unit=unit,
            frequency=ScheduleFrequencyModel(frequency.value),
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
        )

        logger.info(f"KPI created: {kpi.id}")

        return KPI(
            id=kpi.id,
            name=kpi.name,
            description=kpi.description,
            source=source,
            metric_query=kpi.metric_query,
            target_value=kpi.target_value,
            current_value=kpi.current_value,
            unit=kpi.unit,
            frequency=frequency,
            created_by=kpi.created_by,
            tenant_id=kpi.tenant_id,
            is_public=kpi.is_public,
            status=ReportStatus(kpi.status.value),
            created_at=kpi.created_at,
            updated_at=kpi.updated_at,
        )

    async def get_kpi(self, kpi_id: UUID) -> KPI | None:
        """Get a KPI by ID."""
        kpi = await self.kpi_repo.get_by_id(kpi_id)
        if not kpi:
            return None

        return KPI(
            id=kpi.id,
            name=kpi.name,
            description=kpi.description,
            source=ReportSource(kpi.source.value),
            metric_query=kpi.metric_query,
            target_value=kpi.target_value,
            current_value=kpi.current_value,
            unit=kpi.unit,
            frequency=ScheduleFrequency(kpi.frequency.value),
            created_by=kpi.created_by,
            tenant_id=kpi.tenant_id,
            is_public=kpi.is_public,
            status=ReportStatus(kpi.status.value),
            created_at=kpi.created_at,
            updated_at=kpi.updated_at,
        )

    async def search_kpis(
        self,
        source: ReportSource | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool | None = None,
        status: ReportStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[KPI], int]:
        """Search KPIs."""
        kpis, total = await self.kpi_repo.search(
            source=ReportSourceModel(source.value) if source else None,
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
            status=ReportStatusModel(status.value) if status else None,
            limit=limit,
            offset=offset,
        )

        return [
            KPI(
                id=k.id,
                name=k.name,
                description=k.description,
                source=ReportSource(k.source.value),
                metric_query=k.metric_query,
                target_value=k.target_value,
                current_value=k.current_value,
                unit=k.unit,
                frequency=ScheduleFrequency(k.frequency.value),
                created_by=k.created_by,
                tenant_id=k.tenant_id,
                is_public=k.is_public,
                status=ReportStatus(k.status.value),
                created_at=k.created_at,
                updated_at=k.updated_at,
            )
            for k in kpis
        ], total


class ReportExecutionService:
    """Report execution service."""

    def __init__(self, execution_repo: ReportExecutionRepository):
        """Initialize service."""
        self.execution_repo = execution_repo

    async def create_execution(
        self,
        report_id: UUID,
        format: ReportFormat,
        parameters: dict | None = None,
        executed_by: UUID | None = None,
    ) -> ReportExecution:
        """Create a report execution."""
        execution = await self.execution_repo.create(
            report_id=report_id,
            format=ReportFormatModel(format.value),
            parameters=parameters,
            executed_by=executed_by,
        )

        logger.info(f"Report execution created: {execution.id}")

        return ReportExecution(
            id=execution.id,
            report_id=execution.report_id,
            executed_by=execution.executed_by,
            parameters=execution.parameters,
            format=format,
            file_path=execution.file_path,
            status=execution.status,
            error_message=execution.error_message,
            created_at=execution.created_at,
            completed_at=execution.completed_at,
        )

    async def get_execution(self, execution_id: UUID) -> ReportExecution | None:
        """Get an execution by ID."""
        execution = await self.execution_repo.get_by_id(execution_id)
        if not execution:
            return None

        return ReportExecution(
            id=execution.id,
            report_id=execution.report_id,
            executed_by=execution.executed_by,
            parameters=execution.parameters,
            format=ReportFormat(execution.format.value),
            file_path=execution.file_path,
            status=execution.status,
            error_message=execution.error_message,
            created_at=execution.created_at,
            completed_at=execution.completed_at,
        )

    async def get_report_executions(
        self,
        report_id: UUID,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[ReportExecution], int]:
        """Get all executions for a report."""
        executions, total = await self.execution_repo.get_by_report(
            report_id=report_id,
            limit=limit,
            offset=offset,
        )

        return [
            ReportExecution(
                id=e.id,
                report_id=e.report_id,
                executed_by=e.executed_by,
                parameters=e.parameters,
                format=ReportFormat(e.format.value),
                file_path=e.file_path,
                status=e.status,
                error_message=e.error_message,
                created_at=e.created_at,
                completed_at=e.completed_at,
            )
            for e in executions
        ], total