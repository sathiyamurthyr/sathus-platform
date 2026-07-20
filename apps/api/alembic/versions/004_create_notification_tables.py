"""Create notification domain tables and indices.

Revision ID: 004_notification_tables
Revises: 003_workflow_tables
Create Date: 2026-07-20 10:51:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '004_notification_tables'
down_revision = '003_workflow_tables'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Create notification_templates table
    op.create_table(
        'notification_templates',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('subject', sa.String(255), nullable=True),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('channel', sa.String(50), nullable=False),
        sa.Column('category', sa.String(50), server_default='system', nullable=False),
        sa.Column('variables', sa.Text(), nullable=True),
        sa.Column('version', sa.Integer(), server_default='1', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('is_deleted', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.create_index('ix_notification_templates_tenant_id', 'notification_templates', ['tenant_id'])
    op.create_index('ix_notification_templates_name', 'notification_templates', ['name'], unique=True)
    op.create_index('ix_notification_templates_channel', 'notification_templates', ['channel'])
    op.create_index('ix_notification_templates_category', 'notification_templates', ['category'])

    # 2. Create notifications table
    op.create_table(
        'notifications',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('template_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('notification_templates.id'), nullable=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('category', sa.String(50), nullable=False),
        sa.Column('priority', sa.String(50), server_default='normal', nullable=False),
        sa.Column('channel', sa.String(50), nullable=False),
        sa.Column('subject', sa.String(255), nullable=True),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('status', sa.String(50), server_default='pending', nullable=False),
        sa.Column('destination', sa.String(500), nullable=True),
        sa.Column('scheduled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('sent_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('delivered_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('opened_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('failure_reason', sa.Text(), nullable=True),
        sa.Column('retry_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('max_retries', sa.Integer(), server_default='3', nullable=False),
        sa.Column('is_deleted', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('notification_metadata', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.create_index('ix_notifications_tenant_id', 'notifications', ['tenant_id'])
    op.create_index('ix_notifications_user_id', 'notifications', ['user_id'])
    op.create_index('ix_notifications_status', 'notifications', ['status'])
    op.create_index('ix_notifications_channel', 'notifications', ['channel'])
    op.create_index('ix_notifications_category', 'notifications', ['category'])

    # 3. Create notification_preferences table
    op.create_table(
        'notification_preferences',
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('email_enabled', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('sms_enabled', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('push_enabled', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('in_app_enabled', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('quiet_hours_start', sa.String(10), nullable=True),
        sa.Column('quiet_hours_end', sa.String(10), nullable=True),
        sa.Column('timezone', sa.String(50), server_default='UTC', nullable=False),
        sa.Column('language', sa.String(10), server_default='en', nullable=False),
        sa.Column('frequency', sa.String(20), server_default='immediate', nullable=False),
        sa.Column('category_preferences', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_notification_preferences_tenant_id', 'notification_preferences', ['tenant_id'])

    # 4. Create notification_history table
    op.create_table(
        'notification_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('notification_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('notifications.id'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('channel', sa.String(50), nullable=False),
        sa.Column('provider', sa.String(50), nullable=True),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('event', sa.String(100), nullable=False),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.create_index('ix_notification_history_tenant_id', 'notification_history', ['tenant_id'])
    op.create_index('ix_notification_history_notification_id', 'notification_history', ['notification_id'])
    op.create_index('ix_notification_history_user_id', 'notification_history', ['user_id'])
    op.create_index('ix_notification_history_event', 'notification_history', ['event'])


def downgrade():
    op.drop_table('notification_history')
    op.drop_table('notification_preferences')
    op.drop_table('notifications')
    op.drop_table('notification_templates')
