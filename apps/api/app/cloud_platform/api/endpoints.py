"""Cloud Platform API Endpoints (EPIC-031 Prompt 04)."""

from uuid import UUID
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.cloud_platform.application.kubernetes_service import KubernetesService
from app.cloud_platform.application.devops_service import DevOpsService
from app.cloud_platform.application.iac_service import IaCService
from app.cloud_platform.infrastructure.models import (
    ClusterStatus,
    NodeStatus,
    NodePoolStatus,
    PipelineStatus,
    RunStatus,
    ArtifactType,
    IaCProvider,
    IaCChangeAction,
    IaCChangeStatus,
)

# Initialize routers
kubernetes_router = APIRouter()
clusters_router = APIRouter()
devops_router = APIRouter()
pipelines_router = APIRouter()
iac_router = APIRouter()
infrastructure_router = APIRouter()

DEFAULT_TENANT_ID = UUID("00000000-0000-0000-0000-000000000001")


# --- Schemas ---
class CreateClusterRequest(BaseModel):
    name: str
    region: str
    version: str = "1.28"
    provider: str = "aws"
    node_type: str = "t3.xlarge"


class ScalePoolRequest(BaseModel):
    desired_nodes: int


class UpgradeClusterRequest(BaseModel):
    target_version: str


class CreatePipelineRequest(BaseModel):
    name: str
    repository_url: str
    branch: str = "main"


class RegisterTemplateRequest(BaseModel):
    name: str
    content: str
    provider: IaCProvider = IaCProvider.TERRAFORM
    description: str | None = None
    variables_schema: Dict[str, Any] = Field(default_factory=dict)


class ApplyChangeRequest(BaseModel):
    change_id: UUID


# --- Kubernetes Endpoints ---

@clusters_router.post("", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def provision_cluster(payload: CreateClusterRequest, db: AsyncSession = Depends(get_db)):
    """Provision a new Kubernetes cluster."""
    service = KubernetesService(db)
    cluster = await service.provision_cluster(
        tenant_id=DEFAULT_TENANT_ID,
        name=payload.name,
        region=payload.region,
        version=payload.version,
        provider=payload.provider,
        node_type=payload.node_type,
    )
    return {
        "message": "Cluster provisioning started successfully",
        "cluster_id": str(cluster.id),
        "name": cluster.name,
        "status": cluster.status,
    }


@clusters_router.get("", response_model=List[Dict[str, Any]])
async def list_clusters(db: AsyncSession = Depends(get_db)):
    """List all clusters for the tenant."""
    service = KubernetesService(db)
    clusters = await service.list_clusters(DEFAULT_TENANT_ID)
    return [
        {
            "id": str(c.id),
            "name": c.name,
            "region": c.region,
            "version": c.version,
            "status": c.status,
            "provider": c.provider,
            "endpoint": c.endpoint,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in clusters
    ]


@clusters_router.get("/{cluster_id}", response_model=Dict[str, Any])
async def get_cluster(cluster_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get detailed information about a cluster including nodes and node pools."""
    service = KubernetesService(db)
    details = await service.get_cluster_details(cluster_id)
    if not details:
        raise HTTPException(status_code=404, detail="Cluster not found")
    
    cluster = details["cluster"]
    return {
        "id": str(cluster.id),
        "name": cluster.name,
        "region": cluster.region,
        "version": cluster.version,
        "status": cluster.status,
        "provider": cluster.provider,
        "endpoint": cluster.endpoint,
        "ca_certificate": cluster.ca_certificate,
        "metrics": details["metrics"],
        "node_pools": [
            {
                "id": str(p.id),
                "name": p.name,
                "node_type": p.node_type,
                "min_nodes": p.min_nodes,
                "max_nodes": p.max_nodes,
                "desired_nodes": p.desired_nodes,
                "status": p.status,
            }
            for p in details["node_pools"]
        ],
        "nodes": [
            {
                "id": str(n.id),
                "name": n.name,
                "node_pool": n.node_pool,
                "status": n.status,
                "role": n.role,
                "kubelet_version": n.kubelet_version,
                "cpu_capacity": n.cpu_capacity,
                "memory_capacity_bytes": n.memory_capacity_bytes,
            }
            for n in details["nodes"]
        ]
    }


@kubernetes_router.post("/clusters/{cluster_id}/node-pools/{pool_id}/scale", response_model=Dict[str, Any])
async def scale_node_pool(cluster_id: UUID, pool_id: UUID, payload: ScalePoolRequest, db: AsyncSession = Depends(get_db)):
    """Scale a node pool desired size."""
    service = KubernetesService(db)
    pool = await service.scale_pool(cluster_id, pool_id, payload.desired_nodes)
    if not pool:
        raise HTTPException(status_code=404, detail="Node pool not found")
    return {
        "message": f"Successfully scaling pool to {pool.desired_nodes} nodes",
        "pool_id": str(pool.id),
        "desired_nodes": pool.desired_nodes,
        "status": pool.status,
    }


@kubernetes_router.post("/clusters/{cluster_id}/upgrade", response_model=Dict[str, Any])
async def upgrade_cluster(cluster_id: UUID, payload: UpgradeClusterRequest, db: AsyncSession = Depends(get_db)):
    """Upgrade cluster Kubernetes version."""
    service = KubernetesService(db)
    cluster = await service.upgrade_cluster(cluster_id, payload.target_version)
    if not cluster:
        raise HTTPException(status_code=404, detail="Cluster not found")
    return {
        "message": "Cluster upgraded successfully",
        "cluster_id": str(cluster.id),
        "version": cluster.version,
        "status": cluster.status,
    }


# --- DevOps Endpoints ---

@pipelines_router.post("", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_pipeline(payload: CreatePipelineRequest, db: AsyncSession = Depends(get_db)):
    """Register a new CI/CD pipeline."""
    service = DevOpsService(db)
    pipeline = await service.register_pipeline(
        tenant_id=DEFAULT_TENANT_ID,
        name=payload.name,
        repository_url=payload.repository_url,
        branch=payload.branch,
    )
    return {
        "message": "Pipeline registered successfully",
        "pipeline_id": str(pipeline.id),
        "name": pipeline.name,
        "branch": pipeline.branch,
    }


@pipelines_router.get("", response_model=List[Dict[str, Any]])
async def list_pipelines(db: AsyncSession = Depends(get_db)):
    """List registered pipelines."""
    service = DevOpsService(db)
    pipelines = await service.list_pipelines(DEFAULT_TENANT_ID)
    return [
        {
            "id": str(p.id),
            "name": p.name,
            "repository_url": p.repository_url,
            "branch": p.branch,
            "status": p.status,
        }
        for p in pipelines
    ]


@pipelines_router.post("/{pipeline_id}/trigger", response_model=Dict[str, Any])
async def trigger_pipeline(pipeline_id: UUID, db: AsyncSession = Depends(get_db)):
    """Trigger a pipeline run simulation."""
    service = DevOpsService(db)
    try:
        run = await service.trigger_run(pipeline_id, trigger_type="webhook")
        return {
            "message": "Pipeline run executed successfully",
            "run_id": str(run.id),
            "run_number": run.run_number,
            "status": run.status,
            "commit_sha": run.commit_sha,
            "steps_logs": run.steps_logs,
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@devops_router.get("/pipelines/{pipeline_id}/runs", response_model=List[Dict[str, Any]])
async def list_pipeline_runs(pipeline_id: UUID, db: AsyncSession = Depends(get_db)):
    """List execution runs for a pipeline."""
    service = DevOpsService(db)
    runs = await service.get_pipeline_runs(pipeline_id)
    return [
        {
            "id": str(r.id),
            "run_number": r.run_number,
            "status": r.status,
            "trigger_type": r.trigger_type,
            "commit_sha": r.commit_sha,
            "started_at": r.started_at.isoformat() if r.started_at else None,
            "finished_at": r.finished_at.isoformat() if r.finished_at else None,
        }
        for r in runs
    ]


@devops_router.get("/artifacts", response_model=List[Dict[str, Any]])
async def list_artifacts(db: AsyncSession = Depends(get_db)):
    """List registered build artifacts (Supply chain SBOM & scan)."""
    service = DevOpsService(db)
    # Using Unified repo
    repo = service.repository
    artifacts = await repo.list_artifacts(DEFAULT_TENANT_ID)
    return [
        {
            "id": str(a.id),
            "name": a.name,
            "version": a.version,
            "type": a.type,
            "url": a.url,
            "digest": a.digest,
            "scan_results": a.scan_results,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }
        for a in artifacts
    ]


# --- IaC Endpoints ---

@iac_router.post("/templates", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def register_template(payload: RegisterTemplateRequest, db: AsyncSession = Depends(get_db)):
    """Register an Infrastructure-as-Code (IaC) template."""
    service = IaCService(db)
    template = await service.register_template(
        tenant_id=DEFAULT_TENANT_ID,
        name=payload.name,
        content=payload.content,
        provider=payload.provider,
        variables_schema=payload.variables_schema,
        description=payload.description,
    )
    return {
        "message": "IaC template registered successfully",
        "template_id": str(template.id),
        "name": template.name,
        "provider": template.provider,
    }


@iac_router.get("/templates", response_model=List[Dict[str, Any]])
async def list_templates(db: AsyncSession = Depends(get_db)):
    """List registered IaC templates."""
    service = IaCService(db)
    templates = await service.list_templates(DEFAULT_TENANT_ID)
    return [
        {
            "id": str(t.id),
            "name": t.name,
            "provider": t.provider,
            "description": t.description,
            "created_at": t.created_at.isoformat() if t.created_at else None,
        }
        for t in templates
    ]


@infrastructure_router.post("/templates/{template_id}/plan", response_model=Dict[str, Any])
async def generate_plan(template_id: UUID, environment: str = "development", db: AsyncSession = Depends(get_db)):
    """Simulate an IaC execution plan and drift check."""
    service = IaCService(db)
    try:
        change = await service.plan_changes(template_id, environment)
        return {
            "message": "Infrastructure plan generated successfully",
            "change_id": str(change.id),
            "environment": change.environment,
            "action": change.action,
            "status": change.status,
            "drift_detected": change.drift_detected,
            "drift_report": change.drift_report,
            "change_summary": change.change_summary,
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@infrastructure_router.post("/apply", response_model=Dict[str, Any])
async def apply_changes(payload: ApplyChangeRequest, db: AsyncSession = Depends(get_db)):
    """Applies a planned infrastructure change."""
    service = IaCService(db)
    try:
        change = await service.apply_changes(payload.change_id)
        return {
            "message": "Infrastructure changes applied successfully",
            "change_id": str(change.id),
            "environment": change.environment,
            "action": change.action,
            "status": change.status,
            "applied_at": change.applied_at.isoformat() if change.applied_at else None,
        }
    except (ValueError, RuntimeError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@iac_router.get("/templates/{template_id}/environments/{environment}/state", response_model=Dict[str, Any])
async def get_state(template_id: UUID, environment: str, db: AsyncSession = Depends(get_db)):
    """Fetch target environment state."""
    service = IaCService(db)
    state = await service.repository.get_iac_state(template_id, environment)
    if not state:
        raise HTTPException(status_code=404, detail="IaC State not found")
    return {
        "template_id": str(state.template_id),
        "environment": state.environment,
        "state_data": state.state_data,
        "is_locked": state.is_locked,
        "locked_by": state.locked_by,
        "updated_at": state.updated_at.isoformat() if state.updated_at else None,
    }
