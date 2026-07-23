"""Unit & Integration tests for Enterprise Cloud Platform (EPIC-031 Prompt 04)."""

import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4
from starlette.testclient import TestClient
from app.main import app
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
    KubernetesCluster,
    ClusterNode,
    NodePool,
    DeploymentPipeline,
    PipelineRun,
    Artifact,
    IaCTemplate,
    IaCState,
    InfrastructureChange,
)

# Create AsyncMock Session for get_db dependency override
async def override_get_db():
    mock_session = AsyncMock()
    
    # Mocking select query results
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = []
    mock_result.scalar_one_or_none.return_value = None
    mock_session.execute.return_value = mock_result
    
    yield mock_session

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


# --- Kubernetes Platform Service Tests ---

@pytest.mark.asyncio
async def test_kubernetes_provisioning():
    """Test provisioning a cluster."""
    session = AsyncMock()
    service = KubernetesService(session)
    
    tenant_id = uuid4()
    cluster = await service.provision_cluster(
        tenant_id=tenant_id,
        name="test-k8s-cluster",
        region="us-east-1",
        version="1.28",
        provider="aws",
    )
    
    assert cluster.name == "test-k8s-cluster"
    assert cluster.region == "us-east-1"
    assert cluster.version == "1.28"
    assert cluster.status == ClusterStatus.ACTIVE
    assert cluster.endpoint is not None


@pytest.mark.asyncio
async def test_kubernetes_scaling():
    """Test scaling a node pool."""
    session = AsyncMock()
    service = KubernetesService(session)
    
    # Setup mock node pool
    cluster_id = uuid4()
    pool_id = uuid4()
    mock_pool = NodePool(
        id=pool_id,
        cluster_id=cluster_id,
        name="default-pool",
        node_type="t3.xlarge",
        min_nodes=1,
        max_nodes=10,
        desired_nodes=2,
        status=NodePoolStatus.ACTIVE,
    )
    
    # Mock repositories
    mock_cluster = KubernetesCluster(
        id=cluster_id,
        tenant_id=uuid4(),
        name="test-cluster",
        status=ClusterStatus.ACTIVE,
    )
    service.repository.get_cluster = AsyncMock(return_value=mock_cluster)
    service.repository.get_node_pool = AsyncMock(return_value=mock_pool)
    service.repository.list_nodes = AsyncMock(return_value=[])
    service.repository.create_node = AsyncMock()
    
    pool = await service.scale_pool(cluster_id, pool_id, desired_nodes=5)
    assert pool is not None
    assert pool.desired_nodes == 5
    assert pool.status == NodePoolStatus.ACTIVE


@pytest.mark.asyncio
async def test_kubernetes_upgrade():
    """Test upgrading a cluster version."""
    session = AsyncMock()
    service = KubernetesService(session)
    
    cluster_id = uuid4()
    mock_cluster = KubernetesCluster(
        id=cluster_id,
        tenant_id=uuid4(),
        name="prod-cluster",
        region="us-west-2",
        status=ClusterStatus.ACTIVE,
        version="1.27",
    )
    
    # Mock repositories
    service.repository.get_cluster = AsyncMock(return_value=mock_cluster)
    service.repository.list_node_pools = AsyncMock(return_value=[])
    service.repository.list_nodes = AsyncMock(return_value=[])
    
    cluster = await service.upgrade_cluster(cluster_id, target_version="1.28")
    assert cluster is not None
    assert cluster.version == "1.28"
    assert cluster.status == ClusterStatus.ACTIVE


# --- DevOps Platform Tests ---

@pytest.mark.asyncio
async def test_devops_pipeline_trigger():
    """Test triggering a GitOps pipeline run and artifact generation."""
    session = AsyncMock()
    service = DevOpsService(session)
    
    pipeline_id = uuid4()
    mock_pipeline = DeploymentPipeline(
        id=pipeline_id,
        tenant_id=uuid4(),
        name="checkout-service",
        repository_url="https://github.com/odyssey/checkout.git",
        branch="main",
        status=PipelineStatus.ACTIVE,
    )
    
    service.repository.get_pipeline = AsyncMock(return_value=mock_pipeline)
    service.repository.list_pipeline_runs = AsyncMock(return_value=[])
    
    # Mock create runs and artifacts
    mock_run = PipelineRun(
        id=uuid4(),
        pipeline_id=pipeline_id,
        run_number=1,
        status=RunStatus.PENDING,
        trigger_type="manual",
    )
    service.repository.create_pipeline_run = AsyncMock(return_value=mock_run)
    service.repository.create_artifact = AsyncMock()
    
    run = await service.trigger_run(pipeline_id, trigger_type="manual")
    assert run is not None
    assert run.status == RunStatus.SUCCESS
    assert len(run.steps_logs) > 0
    assert run.steps_logs[-1]["stage"] == "GitOps Deployment (Staging)"


# --- IaC Platform Tests ---

@pytest.mark.asyncio
async def test_iac_plan_and_apply():
    """Test IaC planning, state locking, and apply workflows."""
    session = AsyncMock()
    service = IaCService(session)
    
    template_id = uuid4()
    mock_template = IaCTemplate(
        id=template_id,
        tenant_id=uuid4(),
        name="networking-vpc",
        content="resource \"aws_vpc\" \"main\" {\n  cidr_block = \"10.0.0.0/16\"\n}",
        provider=IaCProvider.TERRAFORM,
    )
    
    service.repository.get_iac_template = AsyncMock(return_value=mock_template)
    
    # Mock state and changes
    mock_state = IaCState(
        id=uuid4(),
        template_id=template_id,
        environment="development",
        is_locked=False,
    )
    service.repository.get_iac_state = AsyncMock(return_value=mock_state)
    service.repository.create_or_update_iac_state = AsyncMock(return_value=mock_state)
    
    mock_change = InfrastructureChange(
        id=uuid4(),
        template_id=template_id,
        environment="development",
        action=IaCChangeAction.PLAN,
        status=IaCChangeStatus.PENDING,
        change_summary={"add": 1, "change": 0, "destroy": 0, "resources": ["aws_vpc.main"]},
    )
    service.repository.create_infrastructure_change = AsyncMock(return_value=mock_change)
    
    # 1. Test IaC Plan
    plan = await service.plan_changes(template_id, environment="development")
    assert plan is not None
    assert plan.action == IaCChangeAction.PLAN
    assert plan.drift_detected is False
    
    # 2. Test IaC Apply
    # Mock query session execute for fetching change
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_change
    session.execute.return_value = mock_result
    
    applied_change = await service.apply_changes(mock_change.id)
    assert applied_change is not None
    assert applied_change.status == IaCChangeStatus.APPLIED
    assert applied_change.action == IaCChangeAction.APPLY


# --- REST API Endpoint Tests ---

def test_api_list_clusters():
    """Test REST API for listing clusters."""
    response = client.get("/api/v1/cloud/clusters")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_api_list_pipelines():
    """Test REST API for listing pipelines."""
    response = client.get("/api/v1/pipelines")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_api_list_artifacts():
    """Test REST API for listing DevOps artifacts."""
    response = client.get("/api/v1/devops/artifacts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_api_list_iac_templates():
    """Test REST API for listing IaC templates."""
    response = client.get("/api/v1/iac/templates")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
