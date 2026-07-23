"""API v1 router."""

from fastapi import APIRouter

from app.api.v1.endpoints import health
from app.identity.api import endpoints as auth
from app.authorization.api import endpoints as authorization
from app.content.api import endpoints as content
from app.notification.api import endpoints as notification
from app.workflow.api import endpoints as workflow
from app.media.api import endpoints as media
from app.search.api import endpoints as search
from app.audit.api import endpoints as audit
from app.reporting.api import endpoints as reporting
from app.ai.api import endpoints as ai
from app.integration.api import endpoints as integration
from app.administration.api import endpoints as administration
from app.knowledge.api.endpoints import (
    knowledge_router,
    documents_router,
    repository_router,
    collections_router,
    import_router,
    export_router,
    graph_router,
    entities_router,
    relationships_router,
    search_router,
    context_router,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(authorization.router, prefix="/authorization", tags=["authorization"])
api_router.include_router(content.router, prefix="/content", tags=["content"])
api_router.include_router(notification.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(workflow.router, prefix="/workflows", tags=["workflows"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])
api_router.include_router(reporting.router, prefix="/reporting", tags=["reporting"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(integration.router, prefix="/integrations", tags=["integrations"])
api_router.include_router(administration.router, prefix="/admin", tags=["administration"])

# EPIC-028 Knowledge Intelligence Platform Routers
api_router.include_router(knowledge_router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(documents_router, prefix="/documents", tags=["documents"])
api_router.include_router(repository_router, prefix="/repository", tags=["repository"])
api_router.include_router(collections_router, prefix="/collections", tags=["collections"])
api_router.include_router(import_router, prefix="/import", tags=["import"])
api_router.include_router(export_router, prefix="/export", tags=["export"])
api_router.include_router(graph_router, prefix="/knowledge-graph", tags=["knowledge-graph"])
api_router.include_router(entities_router, prefix="/entities", tags=["entities"])
api_router.include_router(relationships_router, prefix="/relationships", tags=["relationships"])
api_router.include_router(search_router, prefix="/semantic-search", tags=["semantic-search"])
api_router.include_router(context_router, prefix="/context", tags=["context"])

# EPIC-031 Cloud Engineering Platform Routers
from app.cloud_platform.api.endpoints import (
    kubernetes_router,
    clusters_router,
    devops_router,
    pipelines_router,
    iac_router,
    infrastructure_router,
)
api_router.include_router(kubernetes_router, prefix="/cloud/kubernetes", tags=["kubernetes"])
api_router.include_router(clusters_router, prefix="/cloud/clusters", tags=["clusters"])
api_router.include_router(devops_router, prefix="/devops", tags=["devops"])
api_router.include_router(pipelines_router, prefix="/pipelines", tags=["pipelines"])
api_router.include_router(iac_router, prefix="/iac", tags=["iac"])
api_router.include_router(infrastructure_router, prefix="/infrastructure", tags=["infrastructure"])

