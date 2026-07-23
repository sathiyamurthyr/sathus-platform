# Enterprise Kubernetes Platform

The Kubernetes Platform module enables provisioning, scaling, upgrading, and telemetry for multi-tenant Kubernetes clusters.

## Features

### 1. Cluster Provisioning
Clusters are provisioned dynamically in specified regions (e.g., `us-east-1`, `eu-west-1`) with specific Kubernetes versions and cloud providers (e.g., AWS EKS, Azure AKS).

### 2. Node Pools & Scaling
- Automatic cluster sizing with minimum, maximum, and desired node pools.
- Horizontal pod and cluster auto-scaling.
- Automatic creation and deletion of mock virtual nodes corresponding to desired pool sizes.

### 3. Cluster Upgrades
Rolling cluster version upgrades that automatically transition nodes to upgrading status, deploy target kubelet versions, and recycle nodes safely.

## Database Schema
- **KubernetesCluster**: Records EKS/AKS configuration, endpoint, cert authority, version, status, and provider.
- **ClusterNode**: Nodes grouped under specific pools, role (worker, control-plane), and capacity metrics (CPU/Memory).
- **NodePool**: Autoscaling specifications linked to clusters.
