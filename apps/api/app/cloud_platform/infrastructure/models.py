"""Cloud Platform database models for EPIC-031 (Prompt 04)."""

from enum import Enum
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    BigInteger,
    String,
    Text,
    func,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB, UUID as PostgresUUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class ClusterStatus(str, Enum):
    PROVISIONING = "provisioning"
    ACTIVE = "active"
    UPGRADING = "upgrading"
    DELETING = "deleting"
    ERROR = "error"


class NodeStatus(str, Enum):
    READY = "ready"
    NOT_READY = "not_ready"
    UNKNOWN = "unknown"


class NodePoolStatus(str, Enum):
    ACTIVE = "active"
    SCALING = "scaling"
    UPGRADING = "upgrading"
    ERROR = "error"


class PipelineStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"


class RunStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ArtifactType(str, Enum):
    CONTAINER_IMAGE = "container_image"
    HELM_CHART = "helm_chart"
    BINARY = "binary"


class IaCProvider(str, Enum):
    TERRAFORM = "terraform"
    OPENTOFU = "opentofu"
    PULUMI = "pulumi"


class IaCChangeAction(str, Enum):
    PLAN = "plan"
    APPLY = "apply"
    DESTROY = "destroy"


class IaCChangeStatus(str, Enum):
    PENDING = "pending"
    APPLIED = "applied"
    FAILED = "failed"


class KubernetesCluster(Base):
    """Kubernetes cluster definition."""

    __tablename__ = "kubernetes_clusters"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    region = Column(String(50), nullable=False, index=True)
    status = Column(SQLEnum(ClusterStatus), default=ClusterStatus.ACTIVE, index=True)
    version = Column(String(50), default="1.28")
    endpoint = Column(String(255), nullable=True)
    ca_certificate = Column(Text, nullable=True)
    provider = Column(String(50), default="aws", index=True)  # aws, azure, gcp, custom
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    nodes = relationship("ClusterNode", back_populates="cluster", cascade="all, delete-orphan")
    node_pools = relationship("NodePool", back_populates="cluster", cascade="all, delete-orphan")


class ClusterNode(Base):
    """Kubernetes cluster node."""

    __tablename__ = "cluster_nodes"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    cluster_id = Column(PostgresUUID(as_uuid=True), ForeignKey("kubernetes_clusters.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    node_pool = Column(String(100), nullable=False, index=True)
    status = Column(SQLEnum(NodeStatus), default=NodeStatus.READY, index=True)
    role = Column(String(50), default="worker")
    kubelet_version = Column(String(50), default="1.28")
    cpu_capacity = Column(Integer, default=4)
    memory_capacity_bytes = Column(BigInteger, default=16106127360)  # 16 GB
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    cluster = relationship("KubernetesCluster", back_populates="nodes")


class NodePool(Base):
    """Kubernetes node pool configuration."""

    __tablename__ = "node_pools"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    cluster_id = Column(PostgresUUID(as_uuid=True), ForeignKey("kubernetes_clusters.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    node_type = Column(String(100), nullable=False)  # t3.xlarge, Standard_D4_v5, etc.
    min_nodes = Column(Integer, default=1)
    max_nodes = Column(Integer, default=10)
    desired_nodes = Column(Integer, default=2)
    status = Column(SQLEnum(NodePoolStatus), default=NodePoolStatus.ACTIVE, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    cluster = relationship("KubernetesCluster", back_populates="node_pools")


class DeploymentPipeline(Base):
    """CI/CD GitOps deployment pipeline."""

    __tablename__ = "deployment_pipelines"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    repository_url = Column(String(1000), nullable=False)
    branch = Column(String(255), default="main")
    config = Column(JSONB, default=dict)
    status = Column(SQLEnum(PipelineStatus), default=PipelineStatus.ACTIVE, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    runs = relationship("PipelineRun", back_populates="pipeline", cascade="all, delete-orphan")


class PipelineRun(Base):
    """CI/CD deployment pipeline run execution."""

    __tablename__ = "pipeline_runs"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    pipeline_id = Column(PostgresUUID(as_uuid=True), ForeignKey("deployment_pipelines.id"), nullable=False, index=True)
    run_number = Column(Integer, nullable=False)
    status = Column(SQLEnum(RunStatus), default=RunStatus.PENDING, index=True)
    trigger_type = Column(String(50), default="manual")  # manual, commit, webhook, schedule
    commit_sha = Column(String(64), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    steps_logs = Column(JSONB, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    pipeline = relationship("DeploymentPipeline", back_populates="runs")
    artifacts = relationship("Artifact", back_populates="pipeline_run", cascade="all, delete-orphan")


class Artifact(Base):
    """Build or deployment generated artifact."""

    __tablename__ = "artifacts"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    pipeline_run_id = Column(PostgresUUID(as_uuid=True), ForeignKey("pipeline_runs.id"), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    version = Column(String(100), nullable=False)
    type = Column(SQLEnum(ArtifactType), default=ArtifactType.CONTAINER_IMAGE, index=True)
    url = Column(String(1000), nullable=False)
    digest = Column(String(255), nullable=True, index=True)  # SHA-256 validation digest
    scan_results = Column(JSONB, default=dict)  # vulnerabilities, SBOM metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    pipeline_run = relationship("PipelineRun", back_populates="artifacts")


class IaCTemplate(Base):
    """Infrastructure as Code configuration template."""

    __tablename__ = "iac_templates"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    provider = Column(SQLEnum(IaCProvider), default=IaCProvider.TERRAFORM, index=True)
    content = Column(Text, nullable=False)
    variables_schema = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    states = relationship("IaCState", back_populates="template", cascade="all, delete-orphan")
    changes = relationship("InfrastructureChange", back_populates="template", cascade="all, delete-orphan")


class IaCModule(Base):
    """Reusable IaC module registry item."""

    __tablename__ = "iac_modules"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    tenant_id = Column(PostgresUUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    source_url = Column(String(1000), nullable=False)
    version = Column(String(50), nullable=False)
    inputs = Column(JSONB, default=list)
    outputs = Column(JSONB, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class IaCState(Base):
    """IaC state tracking model."""

    __tablename__ = "iac_states"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    template_id = Column(PostgresUUID(as_uuid=True), ForeignKey("iac_templates.id"), nullable=False, index=True)
    environment = Column(String(50), default="development", index=True)  # development, testing, staging, production
    state_data = Column(JSONB, default=dict)
    is_locked = Column(Boolean, default=False)
    locked_by = Column(String(255), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    template = relationship("IaCTemplate", back_populates="states")


class InfrastructureChange(Base):
    """Infrastructure change plan and apply records."""

    __tablename__ = "infrastructure_changes"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    template_id = Column(PostgresUUID(as_uuid=True), ForeignKey("iac_templates.id"), nullable=False, index=True)
    environment = Column(String(50), default="development", index=True)
    action = Column(SQLEnum(IaCChangeAction), default=IaCChangeAction.PLAN, index=True)
    status = Column(SQLEnum(IaCChangeStatus), default=IaCChangeStatus.PENDING, index=True)
    drift_detected = Column(Boolean, default=False)
    drift_report = Column(JSONB, default=dict)
    change_summary = Column(JSONB, default=dict)  # add, change, destroy counts
    applied_by = Column(PostgresUUID(as_uuid=True), nullable=True)
    applied_at = Column(DateTime(timezone=True), nullable=True)

    template = relationship("IaCTemplate", back_populates="changes")
