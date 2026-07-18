"""Reporting API endpoints."""

from datetime import date, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.reporting.api.schemas import (
    ReportResponse,
    ReportCreate,
    ReportUpdate,
    ReportSearchResponse,
    DashboardResponse,
    DashboardCreate,
    DashboardUpdate,
    WidgetResponse,
    WidgetCreate,
    WidgetUpdate,
    KPIResponse,
    KPICreate,
    KPIUpdate,
    KPISearchResponse,
    ReportScheduleResponse,
    ReportScheduleCreate,
    ReportExecutionResponse,
    ReportExecutionCreate,
)
from app.reporting.application.services import (
    ReportService,
    DashboardService,
    KPIService,
    ReportExecutionService,
)
from app.reporting.infrastructure.repositories import (
    ReportRepository,
    DashboardRepository,
    WidgetRepository,
    KPIRepository,
    ReportScheduleRepository,
    ReportExecutionRepository,
)
from app.core.database import get_db

router = APIRouter()


# Report endpoints
async def get_report_service(
    session: AsyncSession = Depends(get_db),
) -> ReportService:
    """Get report service."""
    return ReportService(ReportRepository(session))


@router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    report: ReportCreate,
    service: ReportService = Depends(get_report_service),
) -> ReportResponse:
    """Create a report."""
    created = await service.create_report(
        name=report.name,
        report_type=report.report_type,
        source=report.source,
        query_config=report.query_config,
        parameters=report.parameters,
        chart_config=report.chart_config,
        is_public=report.is_public,
    )
    return ReportResponse(
        id=created.id,
        name=created.name,
        description=created.description,
        report_type=created.report_type.value,
        source=created.source.value,
        query_config=created.query_config,
        parameters=created.parameters,
        chart_config=created.chart_config,
        created_by=created.created_by,
        tenant_id=created.tenant_id,
        is_public=created.is_public,
        status=created.status.value,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


@router.get("/reports/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: UUID,
    service: ReportService = Depends(get_report_service),
) -> ReportResponse:
    """Get a report by ID."""
    report = await service.get_report(report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    return ReportResponse(
        id=report.id,
        name=report.name,
        description=report.description,
        report_type=report.report_type.value,
        source=report.source.value,
        query_config=report.query_config,
        parameters=report.parameters,
        chart_config=report.chart_config,
        created_by=report.created_by,
        tenant_id=report.tenant_id,
        is_public=report.is_public,
        status=report.status.value,
        created_at=report.created_at,
        updated_at=report.updated_at,
    )


@router.get("/reports", response_model=ReportSearchResponse)
async def list_reports(
    report_type: str | None = None,
    source: str | None = None,
    created_by: UUID | None = None,
    tenant_id: UUID | None = None,
    is_public: bool | None = None,
    status: str | None = None,
    limit: int = 50,
    offset: int = 0,
    service: ReportService = Depends(get_report_service),
) -> ReportSearchResponse:
    """List reports."""
    from app.reporting.domain.models import ReportType, ReportSource, ReportStatus

    reports, total = await service.search_reports(
        report_type=ReportType(report_type) if report_type else None,
        source=ReportSource(source) if source else None,
        created_by=created_by,
        tenant_id=tenant_id,
        is_public=is_public,
        status=ReportStatus(status) if status else None,
        limit=limit,
        offset=offset,
    )

    return ReportSearchResponse(
        reports=[
            ReportResponse(
                id=r.id,
                name=r.name,
                description=r.description,
                report_type=r.report_type.value,
                source=r.source.value,
                query_config=r.query_config,
                parameters=r.parameters,
                chart_config=r.chart_config,
                created_by=r.created_by,
                tenant_id=r.tenant_id,
                is_public=r.is_public,
                status=r.status.value,
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
            for r in reports
        ],
        total=total,
        limit=limit,
        offset=offset,
    )


# Dashboard endpoints
async def get_dashboard_service(
    session: AsyncSession = Depends(get_db),
) -> DashboardService:
    """Get dashboard service."""
    return DashboardService(DashboardRepository(session))


@router.post("/dashboards", response_model=DashboardResponse, status_code=status.HTTP_201_CREATED)
async def create_dashboard(
    dashboard: DashboardCreate,
    service: DashboardService = Depends(get_dashboard_service),
) -> DashboardResponse:
    """Create a dashboard."""
    created = await service.create_dashboard(
        name=dashboard.name,
        layout_config=dashboard.layout_config,
        is_public=dashboard.is_public,
    )
    return DashboardResponse(
        id=created.id,
        name=created.name,
        description=created.description,
        layout_config=created.layout_config,
        created_by=created.created_by,
        tenant_id=created.tenant_id,
        is_public=created.is_public,
        status=created.status.value,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


@router.get("/dashboards/{dashboard_id}", response_model=DashboardResponse)
async def get_dashboard(
    dashboard_id: UUID,
    service: DashboardService = Depends(get_dashboard_service),
) -> DashboardResponse:
    """Get a dashboard by ID."""
    dashboard = await service.get_dashboard(dashboard_id)
    if not dashboard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dashboard not found",
        )
    return DashboardResponse(
        id=dashboard.id,
        name=dashboard.name,
        description=dashboard.description,
        layout_config=dashboard.layout_config,
        created_by=dashboard.created_by,
        tenant_id=dashboard.tenant_id,
        is_public=dashboard.is_public,
        status=dashboard.status.value,
        created_at=dashboard.created_at,
        updated_at=dashboard.updated_at,
    )


@router.get("/dashboards", response_model=ReportSearchResponse)
async def list_dashboards(
    created_by: UUID | None = None,
    tenant_id: UUID | None = None,
    is_public: bool | None = None,
    status: str | None = None,
    limit: int = 50,
    offset: int = 0,
    service: DashboardService = Depends(get_dashboard_service),
) -> ReportSearchResponse:
    """List dashboards."""
    from app.reporting.domain.models import ReportStatus

    dashboards, total = await service.search_dashboards(
        created_by=created_by,
        tenant_id=tenant_id,
        is_public=is_public,
        status=ReportStatus(status) if status else None,
        limit=limit,
        offset=offset,
    )

    return ReportSearchResponse(
        reports=[
            ReportResponse(
                id=d.id,
                name=d.name,
                description=d.description,
                report_type="dashboard",
                source="administration",
                query_config=d.layout_config,
                parameters={},
                chart_config={},
                created_by=d.created_by,
                tenant_id=d.tenant_id,
                is_public=d.is_public,
                status=d.status.value,
                created_at=d.created_at,
                updated_at=d.updated_at,
            )
            for d in dashboards
        ],
        total=total,
        limit=limit,
        offset=offset,
    )


# KPI endpoints
async def get_kpi_service(
    session: AsyncSession = Depends(get_db),
) -> KPIService:
    """Get KPI service."""
    return KPIService(KPIRepository(session))


@router.post("/kpis", response_model=KPIResponse, status_code=status.HTTP_201_CREATED)
async def create_kpi(
    kpi: KPICreate,
    service: KPIService = Depends(get_kpi_service),
) -> KPIResponse:
    """Create a KPI."""
    created = await service.create_kpi(
        name=kpi.name,
        source=kpi.source,
        metric_query=kpi.metric_query,
        target_value=kpi.target_value,
        current_value=kpi.current_value,
        unit=kpi.unit,
        frequency=kpi.frequency,
        is_public=kpi.is_public,
    )
    return KPIResponse(
        id=created.id,
        name=created.name,
        description=created.description,
        source=created.source.value,
        metric_query=created.metric_query,
        target_value=created.target_value,
        current_value=created.current_value,
        unit=created.unit,
        frequency=created.frequency.value,
        created_by=created.created_by,
        tenant_id=created.tenant_id,
        is_public=created.is_public,
        status=created.status.value,
        created_at=created.created_at,
        updated_at=created.updated_at,
    )


@router.get("/kpis/{kpi_id}", response_model=KPIResponse)
async def get_kpi(
    kpi_id: UUID,
    service: KPIService = Depends(get_kpi_service),
) -> KPIResponse:
    """Get a KPI by ID."""
    kpi = await service.get_kpi(kpi_id)
    if not kpi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="KPI not found",
        )
    return KPIResponse(
        id=kpi.id,
        name=kpi.name,
        description=kpi.description,
        source=kpi.source.value,
        metric_query=kpi.metric_query,
        target_value=kpi.target_value,
        current_value=kpi.current_value,
        unit=kpi.unit,
        frequency=kpi.frequency.value,
        created_by=kpi.created_by,
        tenant_id=kpi.tenant_id,
        is_public=kpi.is_public,
        status=kpi.status.value,
        created_at=kpi.created_at,
        updated_at=kpi.updated_at,
    )


@router.get("/kpis", response_model=KPISearchResponse)
async def list_kpis(
    source: str | None = None,
    created_by: UUID | None = None,
    tenant_id: UUID | None = None,
    is_public: bool | None = None,
    status: str | None = None,
    limit: int = 50,
    offset: int = 0,
    service: KPIService = Depends(get_kpi_service),
) -> KPISearchResponse:
    """List KPIs."""
    from app.reporting.domain.models import ReportSource, ReportStatus

    kpis, total = await service.search_kpis(
        source=ReportSource(source) if source else None,
        created_by=created_by,
        tenant_id=tenant_id,
        is_public=is_public,
        status=ReportStatus(status) if status else None,
        limit=limit,
        offset=offset,
    )

    return KPISearchResponse(
        kpis=[
            KPIResponse(
                id=k.id,
                name=k.name,
                description=k.description,
                source=k.source.value,
                metric_query=k.metric_query,
                target_value=k.target_value,
                current_value=k.current_value,
                unit=k.unit,
                frequency=k.frequency.value,
                created_by=k.created_by,
                tenant_id=k.tenant_id,
                is_public=k.is_public,
                status=k.status.value,
                created_at=k.created_at,
                updated_at=k.updated_at,
            )
            for k in kpis
        ],
        total=total,
        limit=limit,
        offset=offset,
    )