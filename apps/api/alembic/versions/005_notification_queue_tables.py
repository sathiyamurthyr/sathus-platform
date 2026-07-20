"""Create notification queue, worker, and delivery metrics tables and indices.

Revision ID: 005_notification_queue_tables
Revises: 004_notification_tables
Create Date: 2026-07-20 11:10:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '005_notification_queue_tables'
down_revision = '004_notification_tables'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Create notification_jobs table
    op.create_table(
        'notification_jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('notification_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('notifications.id'), nullable=False),
        sa.Column('queue_name', sa.String(100), nullable=False, server_default='normal'),
        sa.Column('status', sa.String(50), nullable=False, server_default='queued'),
        sa.Column('priority', sa.String(50), nullable=False, server_default='normal'),
        sa.Column('attempts', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('max_retries', sa.Integer(), nullable=False, server_default='3'),
        sa.Column('scheduled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('run_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('locked_by_worker', sa.String(255), nullable=True),
        sa.Column('locked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('payload', sa.Text(), nullable=False),
        sa.Column('job_metadata', sa.Text(), nullable=True),
        sa.Column('failure_reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_notification_jobs_tenant_id', 'notification_jobs', ['tenant_id'])
    op.create_index('ix_notification_jobs_notification_id', 'notification_jobs', ['notification_id'])
    op.create_index('ix_notification_jobs_queue_name', 'notification_jobs', ['queue_name'])
    op.create_index('ix_notification_jobs_status', 'notification_jobs', ['status'])
    op.create_index('ix_notification_jobs_priority', 'notification_jobs', ['priority'])

    # 2. Create notification_job_history table
    op.create_table(
        'notification_job_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('job_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('notification_jobs.id'), nullable=False),
        sa.Column('state', sa.String(50), nullable=False),
        sa.Column('worker_id', sa.String(255), nullable=True),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_notification_job_history_job_id', 'notification_job_history', ['job_id'])
    op.create_index('ix_notification_job_history_state', 'notification_job_history', ['state'])

    # 3. Create worker_status table
    op.create_table(
        'worker_status',
        sa.Column('worker_id', sa.String(255), primary_key=True),
        sa.Column('worker_type', sa.String(100), nullable=False),
        sa.Column('hostname', sa.String(255), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='active'),
        sa.Column('active_jobs_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('processed_jobs_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('failed_jobs_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('last_heartbeat', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_worker_status_worker_type', 'worker_status', ['worker_type'])
    op.create_index('ix_worker_status_status', 'worker_status', ['status'])

    # 4. Create queue_metrics table
    op.create_table(
        'queue_metrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('queue_name', sa.String(100), nullable=False),
        sa.Column('total_enqueued', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('total_processed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('total_failed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('dlq_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('avg_latency_ms', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('recorded_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_queue_metrics_queue_name', 'queue_metrics', ['queue_name'])

    # 5. Create delivery_attempts table
    op.create_table(
        'delivery_attempts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('job_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('notification_jobs.id'), nullable=False),
        sa.Column('provider_name', sa.String(100), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('response_code', sa.String(50), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('attempt_number', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('duration_ms', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('worker_id', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_delivery_attempts_job_id', 'delivery_attempts', ['job_id'])
    op.create_index('ix_delivery_attempts_provider_name', 'delivery_attempts', ['provider_name'])


def downgrade():
    op.drop_table('delivery_attempts')
    op.drop_table('queue_metrics')
    op.drop_table('worker_status')
    op.drop_table('notification_job_history')
    op.drop_table('notification_jobs')
