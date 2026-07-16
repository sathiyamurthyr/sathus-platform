# FEATURE-10.8 — Enterprise Search Platform

A reusable, platform-level search service for the Sathus Platform. It indexes **all** Sathus
content (pages, products, documentation, blogs, media, navigation, forms, users, knowledge base,
and future modules) and powers Website Search, CMS Search, Documentation Search, Product Search,
Learning Center, Trust Center, Developer Portal, and the global command palette.

> This is **not** a page-search or a raw `LIKE` query. It is a real indexing + ranking engine with a
> swappable provider abstraction so future engines (Meilisearch, OpenSearch, Elasticsearch, Azure AI
> Search) require **no business-logic changes**.

## Architecture

Clean Architecture / DDD / CQRS with MediatR, the Repository pattern, and the Specification pattern.

```
src/
  Sathus.Search.Domain         Entities, value objects, enums, domain events, exceptions, permissions
  Sathus.Search.Application    CQRS (commands/queries), validators, provider/repository interfaces, DTOs
  Sathus.Search.Infrastructure EF Core persistence + PostgreSQL search provider + indexing engine
  Sathus.Search.Api            REST API (JWT, Swagger, Serilog, OpenTelemetry, health checks)
  Sathus.Search.Tests          Unit, handler, ranker, permission, and validator tests
apps/admin/src/features/search React feature: search bar, autocomplete, results, facets, filters,
                                command palette, recent/saved searches, empty state
```

## Search Provider Abstraction

`ISearchProvider` (`src/Sathus.Search.Application/Interfaces/ISearchProvider.cs`) is the seam between
business logic and the underlying engine. The only shipped implementation is
`PostgreSqlSearchProvider`, which uses PostgreSQL full-text search (`tsvector` / `websearch_to_tsquery`)
and `ts_headline` highlighting against a single `search.documents` table.

Switching providers is **configuration only** — register a different `ISearchProvider` implementation
in `src/Sathus.Search.Infrastructure/Extensions/ServiceCollectionExtensions.cs`. The application layer
never references a concrete provider.

Prepared-but-not-yet-implemented providers (same contract, no business changes needed):
Meilisearch, OpenSearch, Elasticsearch, Azure AI Search.

## Index Model

`SearchIndex` owns collections of `SearchField`, `SearchFacet`, `SearchSynonym`, `SearchRanking`, and
`SearchHighlight`. `SearchDocument` is the indexed unit. Supporting value objects: `SearchFilter`,
`SearchSort`, `SearchPagination`, `SearchScore`.

## Index Sources

Implemented `IContentSourceProvider` strategies exist for every source type: Pages, Products,
Documentation, Blogs, Media, Navigation, Forms, Users, Knowledge Base. Each returns
`SearchDocument`s to index; real source connectors integrate later without touching the indexer.

## Indexing

`ISearchIndexer` (`SearchIndexer`) supports create, update, delete, incremental indexing
(`IndexAsync` / `IndexRangeAsync`), full rebuild (`RebuildAsync`), and scheduled/background indexing
via `SearchBackgroundIndexingService` (a hosted service that scans pending documents every 5 minutes).

## Search Features

Keyword, phrase, prefix, fuzzy, autocomplete/suggestions, faceted search, filters, sorting,
highlighting (`ts_headline`), relevance ranking, and pagination are all available through
`ProviderSearchQuery` / `SearchQuery`.

### Filters

Content type, category, tags, author, publish status, language, date, and permission.

### Permissions / Security

`ISearchPermissionProvider` translates the caller's identity into visibility filters
(`allowed_users`, `required_roles`) so unauthorized documents are never returned. API endpoints are
guarded by policies `search.read`, `search.manage`, `search.reindex` (claim `permission`).

## API

| Method | Route | Policy | Purpose |
| ------ | ----- | ------ | ------- |
| GET | `/api/v1/search` | `search.read` (anonymous GET allowed) | Search |
| GET | `/api/v1/search/suggest` | anonymous | Autocomplete suggestions |
| POST | `/api/v1/search/index` | `search.manage` | Index a document |
| POST | `/api/v1/search/rebuild` | `search.reindex` | Rebuild an index |
| GET | `/api/v1/search/status` | `search.read` | Index status |
| DELETE | `/api/v1/search/documents/{id}` | `search.manage` | Remove a document |

The search GET endpoint is `[AllowAnonymous]` to power public website search; privileged operations
require the corresponding permission.

## Command Palette

`apps/admin/src/features/search/components/CommandPalette.tsx` provides a `Ctrl/Cmd+K` palette with
navigation search, global search entry, recent searches, and saved searches. It is keyboard-navigable
and WCAG AA oriented.

## Observability

- **Serilog** structured logging (enriched with `Application=Sathus.Search`).
- **OpenTelemetry** tracing + metrics (guarded by `OpenTelemetry:Enabled`, source `Sathus.Search`).
- **Health checks** at `/health` (`search-database`).
- Indexing metrics via the background service logs pending counts.

## Performance

Streaming results, incremental indexing, in-memory synonym caching (`IMemoryCache`, 30-min sliding),
debounced search in the UI (`use-search`), virtualized/lazy results, and PostgreSQL GIN-indexed
`tsvector`.

## Testing

`Sathus.Search.Tests` (xUnit + Moq) covers domain invariants, all CQRS handlers, the ranker, the
permission provider, and validators — **51 tests, all passing**. Run with:

```bash
dotnet test src/Sathus.Search.Tests/Sathus.Search.Tests.csproj
```

## Database

`PostgreSqlSearchProvider.InitializeIndexAsync` is idempotent: it creates the `search` schema, the
`search.documents` table (with a generated `tsv` column and a GIN index), and a
`search.search_suggestions` table. EF Core maps the `Search*` entities to the `search` schema via
`src/Sathus.Search.Infrastructure/Persistence/Configurations/EntityConfigurations.cs`.

## Configuration

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=sathus_search;Username=postgres;Password=postgres"
  },
  "Jwt": { "Secret": "...", "Issuer": "Sathus", "Audience": "Sathus.Api" },
  "OpenTelemetry": { "Enabled": true },
  "Serilog": { "MinimumLevel": "Information" }
}
```

## Integration Points

Wires into Content Engine, DAM (Media), Navigation, Forms, Identity, and Permissions through the
shared `ISearchProvider` / `ISearchIndexer` / `IContentSourceProvider` / `ISearchPermissionProvider`
abstractions and the `search.*` permission claims — no downstream business logic changes required to
add a new search backend.
