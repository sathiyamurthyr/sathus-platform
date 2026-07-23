"""Create cloud platform tables.

Revision ID: 007_cloud_platform_tables
Revises: 006_knowledge_tables
Create Date: 2026-07-22 08:00:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '007_cloud_platform_tables'
down_revision = '006_knowledge_tables'
branch_labels = None
depends_on = None


def upgrade():
    # 1. kubernetes_clusters
    op.create_table(
        'kubernetes_clusters',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('region', sa.String(50), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='active'),
        sa.Column('version', sa.String(50), nullable=False, server_default='1.28'),
        sa.Column('endpoint', sa.String(255), nullable=True),
        sa.Column('ca_certificate', sa.Text(), nullable=True),
        sa.Column('provider', sa.String(50), nullable=False, server_default='aws'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_kubernetes_clusters_tenant_id', 'kubernetes_clusters', ['tenant_id'])
    op.create_index('ix_kubernetes_clusters_region', 'kubernetes_clusters', ['region'])
    op.create_index('ix_kubernetes_clusters_status', 'kubernetes_clusters', ['status'])
    op.create_index('ix_kubernetes_clusters_provider', 'kubernetes_clusters', ['provider'])

    # 2. cluster_nodes
    op.create_table(
        'cluster_nodes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('cluster_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('kubernetes_clusters.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('node_pool', sa.String(100), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='ready'),
        sa.Column('role', sa.String(50), nullable=False, server_default='worker'),
        sa.Column('kubelet_version', sa.String(50), nullable=False, server_default='1.28'),
        sa.Column('cpu_capacity', sa.Integer(), nullable=False, server_default='4'),
        sa.Column('memory_capacity_bytes', sa.BigInteger(), nullable=False, server_default='16106127360'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_cluster_nodes_cluster_id', 'cluster_nodes', ['cluster_id'])
    op.create_index('ix_cluster_nodes_node_pool', 'cluster_nodes', ['node_pool'])
    op.create_index('ix_cluster_nodes_status', 'cluster_nodes', ['status'])

    # 3. node_pools
    op.create_table(
        'node_pools',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('cluster_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('kubernetes_clusters.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('node_type', sa.String(100), nullable=False),
        sa.Column('min_nodes', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('max_nodes', sa.Integer(), nullable=False, server_default='10'),
        sa.Column('desired_nodes', sa.Integer(), nullable=False, server_default='2'),
        sa.Column('status', sa.String(50), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_node_pools_cluster_id', 'node_pools', ['cluster_id'])
    op.create_index('ix_node_pools_status', 'node_pools', ['status'])

    # 4. deployment_pipelines
    op.create_table(
        'deployment_pipelines',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('repository_url', sa.String(1000), nullable=False),
        sa.Column('branch', sa.String(255), nullable=False, server_default='main'),
        sa.Column('config', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('status', sa.String(50), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_deployment_pipelines_tenant_id', 'deployment_pipelines', ['tenant_id'])
    op.create_index('ix_deployment_pipelines_status', 'deployment_pipelines', ['status'])

    # 5. pipeline_runs
    op.create_table(
        'pipeline_runs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('pipeline_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('deployment_pipelines.id', ondelete='CASCADE'), nullable=False),
        sa.Column('run_number', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        sa.Column('trigger_type', sa.String(50), nullable=False, server_default='manual'),
        sa.Column('commit_sha', sa.String(64), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('finished_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('steps_logs', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    )
    op.create_index('ix_pipeline_runs_pipeline_id', 'pipeline_runs', ['pipeline_id'])
    op.create_index('ix_pipeline_runs_status', 'pipeline_runs', ['status'])

    # 6. artifacts
    op.create_table(
        'artifacts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('pipeline_run_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('pipeline_runs.id', ondelete='SET NULL'), nullable=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('version', sa.String(100), nullable=False),
        sa.Column('type', sa.String(50), nullable=False, server_default='container_image'),
        sa.Column('url', sa.String(1000), nullable=False),
        sa.Column('digest', sa.String(255), nullable=True),
        sa.Column('scan_results', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    )
    op.create_index('ix_artifacts_tenant_id', 'artifacts', ['tenant_id'])
    op.create_index('ix_artifacts_pipeline_run_id', 'artifacts', ['pipeline_run_id'])
    op.create_index('ix_artifacts_type', 'artifacts', ['type'])
    op.create_index('ix_artifacts_digest', 'artifacts', ['digest'])

    # 7. iac_templates
    op.create_table(
        'iac_templates',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('provider', sa.String(50), nullable=False, server_default='terraform'),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('variables_schema', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_iac_templates_tenant_id', 'iac_templates', ['tenant_id'])
    op.create_index('ix_iac_templates_provider', 'iac_templates', ['provider'])

    # 8. iac_modules
    op.create_table(
        'iac_modules',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('source_url', sa.String(1000), nullable=False),
        sa.Column('version', sa.String(50), nullable=False),
        sa.Column('inputs', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('outputs', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    )
    op.create_index('ix_iac_modules_tenant_id', 'iac_modules', ['tenant_id'])

    # 9. iac_states
    op.create_table(
        'iac_states',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('template_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('iac_templates.id', ondelete='CASCADE'), nullable=False),
        sa.Column('environment', sa.String(50), nullable=False, server_default='development'),
        sa.Column('state_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('is_locked', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('locked_by', sa.String(255), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_iac_states_template_id', 'iac_states', ['template_id'])
    op.create_index('ix_iac_states_environment', 'iac_states', ['environment'])

    # 10. infrastructure_changes
    op.create_table(
        'infrastructure_changes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('template_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('iac_templates.id', ondelete='CASCADE'), nullable=False),
        sa.Column('environment', sa.String(50), nullable=False, server_default='development'),
        sa.Column('action', sa.String(50), nullable=False, server_default='plan'),
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        sa.Column('drift_detected', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('drift_report', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('change_summary', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('applied_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('applied_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_infrastructure_changes_template_id', 'infrastructure_changes', ['template_id'])
    op.create_index('ix_infrastructure_changes_environment', 'infrastructure_changes', ['environment'])
    op.create_index('ix_infrastructure_changes_action', 'infrastructure_changes', ['action'])
    op.create_index('ix_infrastructure_changes_status', 'infrastructure_changes', ['status'])


def downgrade():
    op.drop_table('infrastructure_changes')
    op.drop_table('iac_states')
    op.drop_table('iac_modules')
    op.drop_table('iac_templates')
    op.drop_table('artifacts')
    op.drop_table('pipeline_runs')
    op.drop_table('deployment_pipelines')
    op.drop_table('node_pools')
    op.drop_table('cluster_nodes')
    op.drop_table('kubernetes_clusters')
