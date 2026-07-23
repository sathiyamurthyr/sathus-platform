"""Create knowledge intelligence platform tables.

Revision ID: 006_knowledge_tables
Revises: 005_notification_queue_tables
Create Date: 2026-07-21 19:50:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '006_knowledge_tables'
down_revision = '005_notification_queue_tables'
branch_labels = None
depends_on = None


def upgrade():
    # 1. knowledge_sources
    op.create_table(
        'knowledge_sources',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('connector_type', sa.String(50), nullable=False),
        sa.Column('status', sa.String(50), server_default='active', nullable=False),
        sa.Column('configuration', postgresql.JSONB(), nullable=True),
        sa.Column('sync_frequency', sa.String(50), server_default='hourly'),
        sa.Column('last_synced_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_knowledge_sources_tenant_id', 'knowledge_sources', ['tenant_id'])
    op.create_index('ix_knowledge_sources_connector_type', 'knowledge_sources', ['connector_type'])
    op.create_index('ix_knowledge_sources_status', 'knowledge_sources', ['status'])

    # 2. knowledge_collections
    op.create_table(
        'knowledge_collections',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('parent_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_collections.id'), nullable=True),
        sa.Column('is_public', sa.Boolean(), server_default='false'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_knowledge_collections_tenant_id', 'knowledge_collections', ['tenant_id'])
    op.create_index('ix_knowledge_collections_name', 'knowledge_collections', ['name'])
    op.create_index('ix_knowledge_collections_slug', 'knowledge_collections', ['slug'])

    # 3. knowledge_documents
    op.create_table(
        'knowledge_documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('source_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_sources.id'), nullable=True),
        sa.Column('collection_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_collections.id'), nullable=True),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('file_path', sa.String(1000), nullable=False),
        sa.Column('file_type', sa.String(50), nullable=False),
        sa.Column('file_size_bytes', sa.Integer(), server_default='0'),
        sa.Column('hash_checksum', sa.String(64), nullable=True),
        sa.Column('language', sa.String(10), server_default='en'),
        sa.Column('status', sa.String(50), server_default='pending'),
        sa.Column('version', sa.Integer(), server_default='1'),
        sa.Column('is_archived', sa.Boolean(), server_default='false'),
        sa.Column('parent_document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_documents.id'), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_knowledge_documents_tenant_id', 'knowledge_documents', ['tenant_id'])
    op.create_index('ix_knowledge_documents_source_id', 'knowledge_documents', ['source_id'])
    op.create_index('ix_knowledge_documents_collection_id', 'knowledge_documents', ['collection_id'])
    op.create_index('ix_knowledge_documents_title', 'knowledge_documents', ['title'])
    op.create_index('ix_knowledge_documents_file_type', 'knowledge_documents', ['file_type'])
    op.create_index('ix_knowledge_documents_status', 'knowledge_documents', ['status'])

    # 4. knowledge_versions
    op.create_table(
        'knowledge_versions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_documents.id'), nullable=False),
        sa.Column('version_number', sa.Integer(), nullable=False),
        sa.Column('change_summary', sa.Text(), nullable=True),
        sa.Column('content_hash', sa.String(64), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_knowledge_versions_document_id', 'knowledge_versions', ['document_id'])

    # 5. knowledge_metadata
    op.create_table(
        'knowledge_metadata',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_documents.id'), nullable=False),
        sa.Column('key', sa.String(100), nullable=False),
        sa.Column('value', sa.Text(), nullable=False),
        sa.Column('data_type', sa.String(50), server_default='string'),
        sa.Column('confidence', sa.Float(), server_default='1.0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_knowledge_metadata_document_id', 'knowledge_metadata', ['document_id'])
    op.create_index('ix_knowledge_metadata_key', 'knowledge_metadata', ['key'])

    # 6. knowledge_chunks
    op.create_table(
        'knowledge_chunks',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_documents.id'), nullable=False),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('token_count', sa.Integer(), server_default='0'),
        sa.Column('start_char', sa.Integer(), server_default='0'),
        sa.Column('end_char', sa.Integer(), server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_knowledge_chunks_document_id', 'knowledge_chunks', ['document_id'])

    # 7. knowledge_tags
    op.create_table(
        'knowledge_tags',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('category', sa.String(100), server_default='general'),
        sa.Column('color', sa.String(20), server_default='#6366f1'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_knowledge_tags_tenant_id', 'knowledge_tags', ['tenant_id'])

    # 8. knowledge_events
    op.create_table(
        'knowledge_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('resource_type', sa.String(100), nullable=False),
        sa.Column('resource_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('payload', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_knowledge_events_tenant_id', 'knowledge_events', ['tenant_id'])

    # 9. knowledge_permissions
    op.create_table(
        'knowledge_permissions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('principal_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('principal_type', sa.String(50), nullable=False),
        sa.Column('resource_type', sa.String(50), nullable=False),
        sa.Column('resource_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('permission', sa.String(50), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_knowledge_permissions_tenant_id', 'knowledge_permissions', ['tenant_id'])

    # 10. knowledge_import_jobs
    op.create_table(
        'knowledge_import_jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('job_type', sa.String(50), nullable=False),
        sa.Column('status', sa.String(50), server_default='pending'),
        sa.Column('processed_count', sa.Integer(), server_default='0'),
        sa.Column('total_count', sa.Integer(), server_default='0'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('metadata_payload', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_knowledge_import_jobs_tenant_id', 'knowledge_import_jobs', ['tenant_id'])

    # 11. knowledge_entities
    op.create_table(
        'knowledge_entities',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('entity_type', sa.String(100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('confidence', sa.Float(), server_default='1.0'),
        sa.Column('attributes', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_knowledge_entities_tenant_id', 'knowledge_entities', ['tenant_id'])
    op.create_index('ix_knowledge_entities_name', 'knowledge_entities', ['name'])

    # 12. knowledge_relationships
    op.create_table(
        'knowledge_relationships',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('source_entity_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_entities.id'), nullable=False),
        sa.Column('target_entity_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_entities.id'), nullable=False),
        sa.Column('relation_type', sa.String(100), nullable=False),
        sa.Column('weight', sa.Float(), server_default='1.0'),
        sa.Column('confidence', sa.Float(), server_default='1.0'),
        sa.Column('properties', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_knowledge_relationships_tenant_id', 'knowledge_relationships', ['tenant_id'])
    op.create_index('ix_knowledge_relationships_source_entity_id', 'knowledge_relationships', ['source_entity_id'])
    op.create_index('ix_knowledge_relationships_target_entity_id', 'knowledge_relationships', ['target_entity_id'])

    # 13. ontology_models
    op.create_table(
        'ontology_models',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('version', sa.String(50), server_default='1.0.0'),
        sa.Column('schema_definition', postgresql.JSONB(), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_ontology_models_tenant_id', 'ontology_models', ['tenant_id'])

    # 14. graph_nodes
    op.create_table(
        'graph_nodes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('label', sa.String(255), nullable=False),
        sa.Column('node_type', sa.String(100), nullable=False),
        sa.Column('properties', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_graph_nodes_tenant_id', 'graph_nodes', ['tenant_id'])

    # 15. graph_edges
    op.create_table(
        'graph_edges',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('source_node_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('graph_nodes.id'), nullable=False),
        sa.Column('target_node_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('graph_nodes.id'), nullable=False),
        sa.Column('edge_type', sa.String(100), nullable=False),
        sa.Column('weight', sa.Float(), server_default='1.0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_graph_edges_tenant_id', 'graph_edges', ['tenant_id'])

    # 16. semantic_indexes
    op.create_table(
        'semantic_indexes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('index_name', sa.String(255), nullable=False),
        sa.Column('dimension', sa.Integer(), server_default='1536'),
        sa.Column('metric', sa.String(50), server_default='cosine'),
        sa.Column('total_vectors', sa.Integer(), server_default='0'),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_semantic_indexes_tenant_id', 'semantic_indexes', ['tenant_id'])

    # 17. search_embeddings
    op.create_table(
        'search_embeddings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('chunk_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_chunks.id'), nullable=True),
        sa.Column('entity_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_entities.id'), nullable=True),
        sa.Column('model_name', sa.String(100), server_default='text-embedding-3-small'),
        sa.Column('embedding_vector', postgresql.JSONB(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_search_embeddings_tenant_id', 'search_embeddings', ['tenant_id'])

    # 18. context_profiles
    op.create_table(
        'context_profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('scope', sa.String(50), nullable=False),
        sa.Column('max_tokens', sa.Integer(), server_default='128000'),
        sa.Column('settings', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_context_profiles_tenant_id', 'context_profiles', ['tenant_id'])

    # 19. context_windows
    op.create_table(
        'context_windows',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', sa.String(255), nullable=False),
        sa.Column('allocated_tokens', sa.Integer(), server_default='0'),
        sa.Column('max_limit', sa.Integer(), server_default='128000'),
        sa.Column('window_data', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_context_windows_tenant_id', 'context_windows', ['tenant_id'])
    op.create_index('ix_context_windows_session_id', 'context_windows', ['session_id'])

    # 20. context_cache
    op.create_table(
        'context_cache',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('cache_key', sa.String(255), nullable=False, unique=True),
        sa.Column('compressed_content', sa.Text(), nullable=False),
        sa.Column('token_count', sa.Integer(), server_default='0'),
        sa.Column('ttl_seconds', sa.Integer(), server_default='3600'),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )
    op.create_index('ix_context_cache_tenant_id', 'context_cache', ['tenant_id'])
    op.create_index('ix_context_cache_cache_key', 'context_cache', ['cache_key'])


def downgrade():
    op.drop_table('context_cache')
    op.drop_table('context_windows')
    op.drop_table('context_profiles')
    op.drop_table('search_embeddings')
    op.drop_table('semantic_indexes')
    op.drop_table('graph_edges')
    op.drop_table('graph_nodes')
    op.drop_table('ontology_models')
    op.drop_table('knowledge_relationships')
    op.drop_table('knowledge_entities')
    op.drop_table('knowledge_import_jobs')
    op.drop_table('knowledge_permissions')
    op.drop_table('knowledge_events')
    op.drop_table('knowledge_tags')
    op.drop_table('knowledge_chunks')
    op.drop_table('knowledge_metadata')
    op.drop_table('knowledge_versions')
    op.drop_table('knowledge_documents')
    op.drop_table('knowledge_collections')
    op.drop_table('knowledge_sources')
