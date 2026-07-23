"""Kubernetes Cluster application service."""

import uuid
from uuid import UUID
from typing import Sequence, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.cloud_platform.infrastructure.repositories import CloudPlatformRepository
from app.cloud_platform.infrastructure.models import (
    KubernetesCluster,
    ClusterNode,
    NodePool,
    ClusterStatus,
    NodeStatus,
    NodePoolStatus,
)


class KubernetesService:
    """Service handling Kubernetes clusters, nodes, and scaling operations."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = CloudPlatformRepository(session)

    async def provision_cluster(
        self, tenant_id: UUID, name: str, region: str, version: str = "1.28", provider: str = "aws", node_type: str = "t3.xlarge"
    ) -> KubernetesCluster:
        """Provision a new Kubernetes cluster with a default node pool and nodes."""
        cluster = await self.repository.create_cluster(
            tenant_id=tenant_id,
            name=name,
            region=region,
            version=version,
            provider=provider,
        )
        cluster.endpoint = f"https://{cluster.id}.yl4.{region}.eks.amazonaws.com"
        cluster.ca_certificate = "MIIEowIBAAKCAQEAn3s5H2...[MOCKED_CA_CERTIFICATE]...="
        
        # Create default node pool
        pool = await self.repository.create_node_pool(
            cluster_id=cluster.id,
            name="default-pool",
            node_type=node_type,
            min_nodes=1,
            max_nodes=10,
            desired_nodes=2,
        )

        # Create nodes matching the desired size
        for i in range(pool.desired_nodes):
            await self.repository.create_node(
                cluster_id=cluster.id,
                name=f"{cluster.name}-node-{i+1}",
                node_pool=pool.name,
            )

        return cluster

    async def list_clusters(self, tenant_id: UUID) -> Sequence[KubernetesCluster]:
        return await self.repository.list_clusters(tenant_id)

    async def get_cluster_details(self, cluster_id: UUID) -> Dict[str, Any] | None:
        cluster = await self.repository.get_cluster(cluster_id)
        if not cluster:
            return None

        nodes = await self.repository.list_nodes(cluster_id)
        pools = await self.repository.list_node_pools(cluster_id)

        return {
            "cluster": cluster,
            "nodes": nodes,
            "node_pools": pools,
            "metrics": {
                "total_cpu_cores": sum(n.cpu_capacity for n in nodes if n.status == NodeStatus.READY),
                "total_memory_gb": round(sum(n.memory_capacity_bytes for n in nodes if n.status == NodeStatus.READY) / (1024**3), 2),
                "active_nodes_count": len([n for n in nodes if n.status == NodeStatus.READY]),
            }
        }

    async def scale_pool(self, cluster_id: UUID, pool_id: UUID, desired_nodes: int) -> NodePool | None:
        """Scales a node pool and spins up/tears down node definitions accordingly."""
        pool = await self.repository.get_node_pool(pool_id)
        if not pool or pool.cluster_id != cluster_id:
            return None

        cluster = await self.repository.get_cluster(cluster_id)
        cluster_name = cluster.name if cluster else "k8s-cluster"

        # Clamp values
        desired_nodes = max(pool.min_nodes, min(desired_nodes, pool.max_nodes))
        current_desired = pool.desired_nodes
        pool.desired_nodes = desired_nodes
        pool.status = NodePoolStatus.SCALING

        # Get existing nodes in this pool
        nodes = await self.repository.list_nodes(cluster_id)
        pool_nodes = [n for n in nodes if n.node_pool == pool.name]

        # Add nodes if scaled up
        if desired_nodes > current_desired:
            for i in range(len(pool_nodes), desired_nodes):
                await self.repository.create_node(
                    cluster_id=cluster_id,
                    name=f"{cluster_name}-node-{i+1}",
                    node_pool=pool.name,
                )
        # Remove nodes if scaled down
        elif desired_nodes < current_desired:
            nodes_to_remove = pool_nodes[desired_nodes:]
            for node in nodes_to_remove:
                await self.session.delete(node)

        pool.status = NodePoolStatus.ACTIVE
        await self.session.flush()
        return pool

    async def upgrade_cluster(self, cluster_id: UUID, target_version: str) -> KubernetesCluster | None:
        """Upgrade the cluster version and node versions."""
        cluster = await self.repository.get_cluster(cluster_id)
        if not cluster:
            return None

        cluster.status = ClusterStatus.UPGRADING
        await self.session.flush()

        # Simulate upgrades on node pools and nodes
        pools = await self.repository.list_node_pools(cluster_id)
        for pool in pools:
            pool.status = NodePoolStatus.UPGRADING
        
        nodes = await self.repository.list_nodes(cluster_id)
        for node in nodes:
            node.status = NodeStatus.UNKNOWN

        # Apply upgrade
        cluster.version = target_version
        cluster.status = ClusterStatus.ACTIVE

        for pool in pools:
            pool.status = NodePoolStatus.ACTIVE
        
        for node in nodes:
            node.kubelet_version = target_version
            node.status = NodeStatus.READY

        await self.session.flush()
        return cluster
