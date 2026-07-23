"""Cloud Platform repositories for CRUD operations."""

from uuid import UUID
from datetime import datetime, timezone
from typing import Sequence
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.cloud_platform.infrastructure.models import (
    KubernetesCluster,
    ClusterNode,
    NodePool,
    DeploymentPipeline,
    PipelineRun,
    Artifact,
    IaCTemplate,
    IaCModule,
    IaCState,
    InfrastructureChange,
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


class CloudPlatformRepository:
    """Unified repository for ECP (Kubernetes, DevOps, and IaC)."""

    def __init__(self, session: AsyncSession):
        self.session = session

    # --- Kubernetes Clusters ---
    async def create_cluster(
        self, tenant_id: UUID, name: str, region: str, version: str = "1.28", provider: str = "aws"
    ) -> KubernetesCluster:
        cluster = KubernetesCluster(
            tenant_id=tenant_id,
            name=name,
            region=region,
            version=version,
            provider=provider,
            status=ClusterStatus.ACTIVE,
        )
        self.session.add(cluster)
        await self.session.flush()
        return cluster

    async def get_cluster(self, cluster_id: UUID) -> KubernetesCluster | None:
        result = await self.session.execute(
            select(KubernetesCluster).where(KubernetesCluster.id == cluster_id)
        )
        return result.scalar_one_or_none()

    async def list_clusters(self, tenant_id: UUID) -> Sequence[KubernetesCluster]:
        result = await self.session.execute(
            select(KubernetesCluster).where(KubernetesCluster.tenant_id == tenant_id)
        )
        return result.scalars().all()

    async def update_cluster_status(self, cluster_id: UUID, status: ClusterStatus) -> KubernetesCluster | None:
        cluster = await self.get_cluster(cluster_id)
        if cluster:
            cluster.status = status
            await self.session.flush()
        return cluster

    # --- Cluster Nodes ---
    async def create_node(
        self, cluster_id: UUID, name: str, node_pool: str, cpu_capacity: int = 4, memory_capacity_bytes: int = 16106127360
    ) -> ClusterNode:
        node = ClusterNode(
            cluster_id=cluster_id,
            name=name,
            node_pool=node_pool,
            status=NodeStatus.READY,
            cpu_capacity=cpu_capacity,
            memory_capacity_bytes=memory_capacity_bytes,
        )
        self.session.add(node)
        await self.session.flush()
        return node

    async def list_nodes(self, cluster_id: UUID) -> Sequence[ClusterNode]:
        result = await self.session.execute(
            select(ClusterNode).where(ClusterNode.cluster_id == cluster_id)
        )
        return result.scalars().all()

    # --- Node Pools ---
    async def create_node_pool(
        self, cluster_id: UUID, name: str, node_type: str, min_nodes: int = 1, max_nodes: int = 10, desired_nodes: int = 2
    ) -> NodePool:
        pool = NodePool(
            cluster_id=cluster_id,
            name=name,
            node_type=node_type,
            min_nodes=min_nodes,
            max_nodes=max_nodes,
            desired_nodes=desired_nodes,
            status=NodePoolStatus.ACTIVE,
        )
        self.session.add(pool)
        await self.session.flush()
        return pool

    async def get_node_pool(self, pool_id: UUID) -> NodePool | None:
        result = await self.session.execute(
            select(NodePool).where(NodePool.id == pool_id)
        )
        return result.scalar_one_or_none()

    async def list_node_pools(self, cluster_id: UUID) -> Sequence[NodePool]:
        result = await self.session.execute(
            select(NodePool).where(NodePool.cluster_id == cluster_id)
        )
        return result.scalars().all()

    # --- Deployment Pipelines ---
    async def create_pipeline(
        self, tenant_id: UUID, name: str, repository_url: str, branch: str = "main", config: dict | None = None
    ) -> DeploymentPipeline:
        pipeline = DeploymentPipeline(
            tenant_id=tenant_id,
            name=name,
            repository_url=repository_url,
            branch=branch,
            config=config or {},
            status=PipelineStatus.ACTIVE,
        )
        self.session.add(pipeline)
        await self.session.flush()
        return pipeline

    async def get_pipeline(self, pipeline_id: UUID) -> DeploymentPipeline | None:
        result = await self.session.execute(
            select(DeploymentPipeline).where(DeploymentPipeline.id == pipeline_id)
        )
        return result.scalar_one_or_none()

    async def list_pipelines(self, tenant_id: UUID) -> Sequence[DeploymentPipeline]:
        result = await self.session.execute(
            select(DeploymentPipeline).where(DeploymentPipeline.tenant_id == tenant_id)
        )
        return result.scalars().all()

    # --- Pipeline Runs ---
    async def create_pipeline_run(
        self, pipeline_id: UUID, run_number: int, trigger_type: str = "manual", commit_sha: str | None = None
    ) -> PipelineRun:
        run = PipelineRun(
            pipeline_id=pipeline_id,
            run_number=run_number,
            status=RunStatus.PENDING,
            trigger_type=trigger_type,
            commit_sha=commit_sha,
            started_at=datetime.now(timezone.utc),
        )
        self.session.add(run)
        await self.session.flush()
        return run

    async def get_pipeline_run(self, run_id: UUID) -> PipelineRun | None:
        result = await self.session.execute(
            select(PipelineRun).where(PipelineRun.id == run_id)
        )
        return result.scalar_one_or_none()

    async def list_pipeline_runs(self, pipeline_id: UUID) -> Sequence[PipelineRun]:
        result = await self.session.execute(
            select(PipelineRun).where(PipelineRun.pipeline_id == pipeline_id)
        )
        return result.scalars().all()

    # --- Artifacts ---
    async def create_artifact(
        self, tenant_id: UUID, name: str, version: str, artifact_type: ArtifactType, url: str, digest: str | None = None, pipeline_run_id: UUID | None = None
    ) -> Artifact:
        artifact = Artifact(
            tenant_id=tenant_id,
            pipeline_run_id=pipeline_run_id,
            name=name,
            version=version,
            type=artifact_type,
            url=url,
            digest=digest,
            scan_results={},
        )
        self.session.add(artifact)
        await self.session.flush()
        return artifact

    async def list_artifacts(self, tenant_id: UUID) -> Sequence[Artifact]:
        result = await self.session.execute(
            select(Artifact).where(Artifact.tenant_id == tenant_id)
        )
        return result.scalars().all()

    # --- IaC Templates ---
    async def create_iac_template(
        self, tenant_id: UUID, name: str, content: str, provider: IaCProvider = IaCProvider.TERRAFORM, variables_schema: dict | None = None, description: str | None = None
    ) -> IaCTemplate:
        template = IaCTemplate(
            tenant_id=tenant_id,
            name=name,
            content=content,
            provider=provider,
            variables_schema=variables_schema or {},
            description=description,
        )
        self.session.add(template)
        await self.session.flush()
        return template

    async def get_iac_template(self, template_id: UUID) -> IaCTemplate | None:
        result = await self.session.execute(
            select(IaCTemplate).where(IaCTemplate.id == template_id)
        )
        return result.scalar_one_or_none()

    async def list_iac_templates(self, tenant_id: UUID) -> Sequence[IaCTemplate]:
        result = await self.session.execute(
            select(IaCTemplate).where(IaCTemplate.tenant_id == tenant_id)
        )
        return result.scalars().all()

    # --- IaC Modules ---
    async def create_iac_module(
        self, tenant_id: UUID, name: str, source_url: str, version: str, inputs: list | None = None, outputs: list | None = None
    ) -> IaCModule:
        module = IaCModule(
            tenant_id=tenant_id,
            name=name,
            source_url=source_url,
            version=version,
            inputs=inputs or [],
            outputs=outputs or [],
        )
        self.session.add(module)
        await self.session.flush()
        return module

    async def list_iac_modules(self, tenant_id: UUID) -> Sequence[IaCModule]:
        result = await self.session.execute(
            select(IaCModule).where(IaCModule.tenant_id == tenant_id)
        )
        return result.scalars().all()

    # --- IaC States ---
    async def get_iac_state(self, template_id: UUID, environment: str = "development") -> IaCState | None:
        result = await self.session.execute(
            select(IaCState)
            .where(IaCState.template_id == template_id)
            .where(IaCState.environment == environment)
        )
        return result.scalar_one_or_none()

    async def create_or_update_iac_state(
        self, template_id: UUID, environment: str, state_data: dict
    ) -> IaCState:
        state = await self.get_iac_state(template_id, environment)
        if not state:
            state = IaCState(
                template_id=template_id,
                environment=environment,
                state_data=state_data,
                is_locked=False,
            )
            self.session.add(state)
        else:
            state.state_data = state_data
        await self.session.flush()
        return state

    # --- Infrastructure Changes ---
    async def create_infrastructure_change(
        self, template_id: UUID, environment: str, action: IaCChangeAction, change_summary: dict, applied_by: UUID | None = None
    ) -> InfrastructureChange:
        change = InfrastructureChange(
            template_id=template_id,
            environment=environment,
            action=action,
            status=IaCChangeStatus.PENDING,
            change_summary=change_summary,
            applied_by=applied_by,
        )
        self.session.add(change)
        await self.session.flush()
        return change

    async def list_infrastructure_changes(self, template_id: UUID) -> Sequence[InfrastructureChange]:
        result = await self.session.execute(
            select(InfrastructureChange).where(InfrastructureChange.template_id == template_id)
        )
        return result.scalars().all()
