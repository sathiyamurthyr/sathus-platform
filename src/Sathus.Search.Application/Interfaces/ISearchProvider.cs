using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Application.Interfaces;

public interface ISearchProvider
{
    Task InitializeIndexAsync(SearchIndex index, CancellationToken cancellationToken);
    Task IndexDocumentAsync(SearchDocument document, CancellationToken cancellationToken);
    Task DeleteDocumentAsync(string externalId, string documentType, CancellationToken cancellationToken);
    Task RebuildIndexAsync(SearchIndex index, CancellationToken cancellationToken);
    Task<ProviderSearchResult> SearchAsync(ProviderSearchQuery query, CancellationToken cancellationToken);
    Task<IReadOnlyList<ProviderSearchSuggestion>> GetSuggestionsAsync(string query, string? documentType, CancellationToken cancellationToken);
    Task<IReadOnlyList<ProviderSearchFacet>> GetFacetsAsync(ProviderSearchQuery query, CancellationToken cancellationToken);
    Task<bool> HealthCheckAsync(CancellationToken cancellationToken);
}

public sealed record ProviderSearchQuery
{
    public string Query { get; set; } = string.Empty;
    public IReadOnlyList<SearchFilter> Filters { get; set; } = Array.Empty<SearchFilter>();
    public IReadOnlyList<SearchSort> Sort { get; set; } = Array.Empty<SearchSort>();
    public SearchPagination Pagination { get; set; } = SearchPagination.Create(1, 20);
    public bool IncludeFacets { get; set; }
    public bool IncludeHighlights { get; set; }
    public bool IncludeSuggestions { get; set; }
    public bool Fuzzy { get; set; }
    public string HighlightPreTag { get; set; } = "<mark>";
    public string HighlightPostTag { get; set; } = "</mark>";
    public string? UserId { get; set; }
    public IReadOnlyList<string> UserRoles { get; set; } = Array.Empty<string>();
}

public sealed record ProviderSearchResult
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public IReadOnlyList<ProviderSearchResultItem> Items { get; set; } = Array.Empty<ProviderSearchResultItem>();
    public IReadOnlyList<ProviderSearchFacet> Facets { get; set; } = Array.Empty<ProviderSearchFacet>();
    public IReadOnlyList<ProviderSearchHighlight> Highlights { get; set; } = Array.Empty<ProviderSearchHighlight>();
    public IReadOnlyList<ProviderSearchSuggestion> Suggestions { get; set; } = Array.Empty<ProviderSearchSuggestion>();
    public long TookMs { get; set; }
}

public sealed record ProviderSearchResultItem(Guid Id, string ExternalId, IndexSourceType SourceType, string Title, string Content, string? Url, string? ImageUrl, string? AuthorName, double Score, IReadOnlyList<string>? Highlights);

public sealed record ProviderSearchFacet(string FieldName, FacetType FacetType, IReadOnlyList<ProviderFacetValue> Values);

public sealed record ProviderFacetValue(string Value, int Count, bool IsSelected);

public sealed record ProviderSearchHighlight(string DocumentId, string FieldName, string[] Fragments);

public sealed record ProviderSearchSuggestion(string Text, string Type, double Weight);
