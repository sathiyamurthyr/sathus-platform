"""Reporting repositories."""

from datetime import date, datetime
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.reporting.infrastructure.models import (
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
)


class ReportRepository:
    """Report repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        status: ReportStatus = ReportStatus.DRAFT,
    ) -> Report:
        """Create a report."""
        report = Report(
            name=name,
            report_type=report_type,
            source=source,
            query_config=query_config,
            parameters=parameters,
            chart_config=chart_config,
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
            status=status,
        )
        self.session.add(report)
        await self.session.flush()
        return report

    async def get_by_id(self, report_id: UUID) -> Report | None:
        """Get report by ID."""
        result = await self.session.execute(
            select(Report).where(Report.id == report_id)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str, tenant_id: UUID | None = None) -> Report | None:
        """Get report by name."""
        query = select(Report).where(Report.name == name)
        if tenant_id:
            query = query.where(Report.tenant_id == tenant_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def search(
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
        """Search reports with filters."""
        query = select(Report)
        conditions = []

        if report_type:
            conditions.append(Report.report_type == report_type)
        if source:
            conditions.append(Report.source == source)
        if created_by:
            conditions.append(Report.created_by == created_by)
        if tenant_id:
            conditions.append(Report.tenant_id == tenant_id)
        if is_public is not None:
            conditions.append(Report.is_public == is_public)
        if status:
            conditions.append(Report.status == status)

        if conditions:
            query = query.where(and_(*conditions))

        # Get total count
        count_query = select(func.count()).select_from(Report)
        if conditions:
            count_query = count_query.where(and_(*conditions))

        count_result = await self.session.execute(count_query)
        total = count_result.scalar_one()

        # Get paginated results
        query = (
            query
            .order_by(Report.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.session.execute(query)
        reports = list(result.scalars().all())

        return reports, total

    async def update(
        self,
        report_id: UUID,
        name: str | None = None,
        description: str | None = None,
        query_config: dict | None = None,
        parameters: dict | None = None,
        chart_config: dict | None = None,
        is_public: bool | None = None,
        status: ReportStatus | None = None,
    ) -> Report | None:
        """Update a report."""
        report = await self.get_by_id(report_id)
        if not report:
            return None

        if name is not None:
            report.name = name
        if description is not None:
            report.description = description
        if query_config is not None:
            report.query_config = query_config
        if parameters is not None:
            report.parameters = parameters
        if chart_config is not None:
            report.chart_config = chart_config
        if is_public is not None:
            report.is_public = is_public
        if status is not None:
            report.status = status

        await self.session.flush()
        return report

    async def delete(self, report_id: UUID) -> bool:
        """Delete a report."""
        report = await self.get_by_id(report_id)
        if not report:
            return False
        await self.session.delete(report)
        return True


class DashboardRepository:
    """Dashboard repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        name: str,
        layout_config: dict,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool = False,
        status: ReportStatus = ReportStatus.DRAFT,
    ) -> Dashboard:
        """Create a dashboard."""
        dashboard = Dashboard(
            name=name,
            layout_config=layout_config,
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
            status=status,
        )
        self.session.add(dashboard)
        await self.session.flush()
        return dashboard

    async def get_by_id(self, dashboard_id: UUID) -> Dashboard | None:
        """Get dashboard by ID."""
        result = await self.session.execute(
            select(Dashboard).where(Dashboard.id == dashboard_id)
        )
        return result.scalar_one_or_none()

    async def search(
        self,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool | None = None,
        status: ReportStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[Dashboard], int]:
        """Search dashboards with filters."""
        query = select(Dashboard)
        conditions = []

        if created_by:
            conditions.append(Dashboard.created_by == created_by)
        if tenant_id:
            conditions.append(Dashboard.tenant_id == tenant_id)
        if is_public is not None:
            conditions.append(Dashboard.is_public == is_public)
        if status:
            conditions.append(Dashboard.status == status)

        if conditions:
            query = query.where(and_(*conditions))

        count_query = select(func.count()).select_from(Dashboard)
        if conditions:
            count_query = count_query.where(and_(*conditions))

        count_result = await self.session.execute(count_query)
        total = count_result.scalar_one()

        query = (
            query
            .order_by(Dashboard.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.session.execute(query)
        dashboards = list(result.scalars().all())

        return dashboards, total

    async def update(
        self,
        dashboard_id: UUID,
        name: str | None = None,
        description: str | None = None,
        layout_config: dict | None = None,
        is_public: bool | None = None,
        status: ReportStatus | None = None,
    ) -> Dashboard | None:
        """Update a dashboard."""
        dashboard = await self.get_by_id(dashboard_id)
        if not dashboard:
            return None

        if name is not None:
            dashboard.name = name
        if description is not None:
            dashboard.description = description
        if layout_config is not None:
            dashboard.layout_config = layout_config
        if is_public is not None:
            dashboard.is_public = is_public
        if status is not None:
            dashboard.status = status

        await self.session.flush()
        return dashboard

    async def delete(self, dashboard_id: UUID) -> bool:
        """Delete a dashboard."""
        dashboard = await self.get_by_id(dashboard_id)
        if not dashboard:
            return False
        await self.session.delete(dashboard)
        return True


class WidgetRepository:
    """Widget repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        dashboard_id: UUID,
        chart_type: ChartType,
        title: str,
        position_x: int = 0,
        position_y: int = 0,
        width: int = 4,
        height: int = 4,
        config: dict | None = None,
        data_source: ReportSource | None = None,
    ) -> Widget:
        """Create a widget."""
        widget = Widget(
            dashboard_id=dashboard_id,
            chart_type=chart_type,
            title=title,
            position_x=position_x,
            position_y=position_y,
            width=width,
            height=height,
            config=config or {},
            data_source=data_source,
        )
        self.session.add(widget)
        await self.session.flush()
        return widget

    async def get_by_id(self, widget_id: UUID) -> Widget | None:
        """Get widget by ID."""
        result = await self.session.execute(
            select(Widget).where(Widget.id == widget_id)
        )
        return result.scalar_one_or_none()

    async def get_by_dashboard(self, dashboard_id: UUID) -> list[Widget]:
        """Get all widgets for a dashboard."""
        result = await self.session.execute(
            select(Widget)
            .where(Widget.dashboard_id == dashboard_id)
            .order_by(Widget.position_x, Widget.position_y)
        )
        return list(result.scalars().all())

    async def update(
        self,
        widget_id: UUID,
        title: str | None = None,
        position_x: int | None = None,
        position_y: int | None = None,
        width: int | None = None,
        height: int | None = None,
        config: dict | None = None,
    ) -> Widget | None:
        """Update a widget."""
        widget = await self.get_by_id(widget_id)
        if not widget:
            return None

        if title is not None:
            widget.title = title
        if position_x is not None:
            widget.position_x = position_x
        if position_y is not None:
            widget.position_y = position_y
        if width is not None:
            widget.width = width
        if height is not None:
            widget.height = height
        if config is not None:
            widget.config = config

        await self.session.flush()
        return widget

    async def delete(self, widget_id: UUID) -> bool:
        """Delete a widget."""
        widget = await self.get_by_id(widget_id)
        if not widget:
            return False
        await self.session.delete(widget)
        return True


class KPIRepository:
    """KPI repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        status: ReportStatus = ReportStatus.ACTIVE,
    ) -> KPI:
        """Create a KPI."""
        kpi = KPI(
            name=name,
            source=source,
            metric_query=metric_query,
            target_value=target_value,
            current_value=current_value,
            unit=unit,
            frequency=frequency,
            created_by=created_by,
            tenant_id=tenant_id,
            is_public=is_public,
            status=status,
        )
        self.session.add(kpi)
        await self.session.flush()
        return kpi

    async def get_by_id(self, kpi_id: UUID) -> KPI | None:
        """Get KPI by ID."""
        result = await self.session.execute(
            select(KPI).where(KPI.id == kpi_id)
        )
        return result.scalar_one_or_none()

    async def search(
        self,
        source: ReportSource | None = None,
        created_by: UUID | None = None,
        tenant_id: UUID | None = None,
        is_public: bool | None = None,
        status: ReportStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[KPI], int]:
        """Search KPIs with filters."""
        query = select(KPI)
        conditions = []

        if source:
            conditions.append(KPI.source == source)
        if created_by:
            conditions.append(KPI.created_by == created_by)
        if tenant_id:
            conditions.append(KPI.tenant_id == tenant_id)
        if is_public is not None:
            conditions.append(KPI.is_public == is_public)
        if status:
            conditions.append(KPI.status == status)

        if conditions:
            query = query.where(and_(*conditions))

        count_query = select(func.count()).select_from(KPI)
        if conditions:
            count_query = count_query.where(and_(*conditions))

        count_result = await self.session.execute(count_query)
        total = count_result.scalar_one()

        query = (
            query
            .order_by(KPI.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.session.execute(query)
        kpis = list(result.scalars().all())

        return kpis, total

    async def update(
        self,
        kpi_id: UUID,
        name: str | None = None,
        description: str | None = None,
        target_value: float | None = None,
        current_value: float | None = None,
        is_public: bool | None = None,
        status: ReportStatus | None = None,
    ) -> KPI | None:
        """Update a KPI."""
        kpi = await self.get_by_id(kpi_id)
        if not kpi:
            return None

        if name is not None:
            kpi.name = name
        if description is not None:
            kpi.description = description
        if target_value is not None:
            kpi.target_value = target_value
        if current_value is not None:
            kpi.current_value = current_value
        if is_public is not None:
            kpi.is_public = is_public
        if status is not None:
            kpi.status = status

        await self.session.flush()
        return kpi

    async def delete(self, kpi_id: UUID) -> bool:
        """Delete a KPI."""
        kpi = await self.get_by_id(kpi_id)
        if not kpi:
            return False
        await self.session.delete(kpi)
        return True


class ReportScheduleRepository:
    """Report schedule repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        report_id: UUID,
        frequency: ScheduleFrequency,
        cron_expression: str | None = None,
        email_recipients: list[str] | None = None,
        notification_recipients: list[UUID] | None = None,
        timezone: str = "UTC",
    ) -> ReportSchedule:
        """Create a report schedule."""
        schedule = ReportSchedule(
            report_id=report_id,
            frequency=frequency,
            cron_expression=cron_expression,
            email_recipients=email_recipients or [],
            notification_recipients=notification_recipients or [],
            timezone=timezone,
        )
        self.session.add(schedule)
        await self.session.flush()
        return schedule

    async def get_by_id(self, schedule_id: UUID) -> ReportSchedule | None:
        """Get schedule by ID."""
        result = await self.session.execute(
            select(ReportSchedule).where(ReportSchedule.id == schedule_id)
        )
        return result.scalar_one_or_none()

    async def get_by_report(self, report_id: UUID) -> list[ReportSchedule]:
        """Get all schedules for a report."""
        result = await self.session.execute(
            select(ReportSchedule)
            .where(ReportSchedule.report_id == report_id)
            .order_by(ReportSchedule.next_run)
        )
        return list(result.scalars().all())

    async def get_pending_schedules(self) -> list[ReportSchedule]:
        """Get all pending schedules that need to run."""
        result = await self.session.execute(
            select(ReportSchedule)
            .where(
                and_(
                    ReportSchedule.is_active == True,
                    ReportSchedule.next_run <= func.now(),
                )
            )
            .order_by(ReportSchedule.next_run)
        )
        return list(result.scalars().all())

    async def update(
        self,
        schedule_id: UUID,
        next_run: datetime | None = None,
        last_run: datetime | None = None,
        is_active: bool | None = None,
    ) -> ReportSchedule | None:
        """Update a schedule."""
        schedule = await self.get_by_id(schedule_id)
        if not schedule:
            return None

        if next_run is not None:
            schedule.next_run = next_run
        if last_run is not None:
            schedule.last_run = last_run
        if is_active is not None:
            schedule.is_active = is_active

        await self.session.flush()
        return schedule

    async def delete(self, schedule_id: UUID) -> bool:
        """Delete a schedule."""
        schedule = await self.get_by_id(schedule_id)
        if not schedule:
            return False
        await self.session.delete(schedule)
        return True


class ReportExecutionRepository:
    """Report execution repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        report_id: UUID,
        format: ReportFormat,
        parameters: dict | None = None,
        executed_by: UUID | None = None,
    ) -> ReportExecution:
        """Create a report execution."""
        execution = ReportExecution(
            report_id=report_id,
            format=format,
            parameters=parameters or {},
            executed_by=executed_by,
        )
        self.session.add(execution)
        await self.session.flush()
        return execution

    async def get_by_id(self, execution_id: UUID) -> ReportExecution | None:
        """Get execution by ID."""
        result = await self.session.execute(
            select(ReportExecution).where(ReportExecution.id == execution_id)
        )
        return result.scalar_one_or_none()

    async def get_by_report(
        self,
        report_id: UUID,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[ReportExecution], int]:
        """Get all executions for a report."""
        query = (
            select(ReportExecution)
            .where(ReportExecution.report_id == report_id)
            .order_by(ReportExecution.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        count_query = select(func.count()).select_from(ReportExecution).where(
            ReportExecution.report_id == report_id
        )

        result = await self.session.execute(query)
        count_result = await self.session.execute(count_query)

        return list(result.scalars().all()), count_result.scalar_one()

    async def update(
        self,
        execution_id: UUID,
        file_path: str | None = None,
        status: str | None = None,
        error_message: str | None = None,
        completed_at: datetime | None = None,
    ) -> ReportExecution | None:
        """Update an execution."""
        execution = await self.get_by_id(execution_id)
        if not execution:
            return None

        if file_path is not None:
            execution.file_path = file_path
        if status is not None:
            execution.status = status
        if error_message is not None:
            execution.error_message = error_message
        if completed_at is not None:
            execution.completed_at = completed_at

        await self.session.flush()
        return execution