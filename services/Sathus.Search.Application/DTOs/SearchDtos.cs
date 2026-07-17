using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Application.DTOs;

public sealed record SearchDocumentResponse(Guid Id, string ExternalId, IndexSourceType SourceType, string Title, string Content, string? Url, string? ImageUrl, string? AuthorName, string Language, string Status, bool IsFeatured, double Score, DateTime IndexedAt, DateTime? PublishedAt, string PermissionScope);

public sealed record SearchResultResponse(int Total, int Page, int PageSize, IReadOnlyList<SearchResultItem> Items, IReadOnlyList<SearchFacetResponse> Facets, IReadOnlyList<SearchHighlightResponse> Highlights, IReadOnlyList<SearchSuggestionResponse> Suggestions, long TookMs);

public sealed record SearchResultItem(Guid Id, string ExternalId, IndexSourceType SourceType, string Title, string Content, string? Url, string? ImageUrl, string? AuthorName, double Score, IReadOnlyList<string>? Highlights);

public sealed record SearchFacetResponse(string FieldName, FacetType FacetType, IReadOnlyList<FacetValue> Values);

public sealed record FacetValue(string Value, int Count, bool IsSelected);

public sealed record SearchHighlightResponse(string DocumentId, string FieldName, string[] Fragments);

public sealed record SearchSuggestionResponse(string Text, string Type, double Weight);

public sealed record RebuildIndexResponse(Guid IndexId, string Code, int DocumentCount, DateTime RebuiltAt, string Status);

public sealed record BulkIndexResponse(Guid IndexId, int Indexed, int Failed, DateTime CompletedAt);

public sealed record SearchIndexStatusResponse(Guid Id, string Code, string Name, bool IsEnabled, DateTime? LastRebuildAt, int DocumentCount);

public sealed record IndexDocumentRequest(Guid IndexId, string ExternalId, string SourceType, string Title, string Content, string? Url = null, string? ImageUrl = null, Guid? AuthorId = null, string? AuthorName = null, string Language = "en", string? Metadata = null, bool IsFeatured = false, DateTime? PublishedAt = null, DateTime? ExpiresAt = null, string PermissionScope = "public", string? RequiredRoles = null, string? AllowedUsers = null, Guid? ActorId = null);

public sealed record RebuildIndexRequest(Guid IndexId);
