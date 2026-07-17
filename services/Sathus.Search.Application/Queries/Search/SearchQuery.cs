using MediatR;
using Sathus.Search.Application.Interfaces;
using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Application.Queries.Search;

public sealed record SearchQuery(
    string Query,
    Guid? IndexId = null,
    IReadOnlyList<SearchFilter>? Filters = null,
    IReadOnlyList<SearchSort>? Sort = null,
    SearchPagination? Pagination = null,
    bool IncludeFacets = true,
    bool IncludeHighlights = true,
    bool IncludeSuggestions = true,
    bool Fuzzy = true,
    string? HighlightPreTag = null,
    string? HighlightPostTag = null,
    string? UserId = null,
    string? UserRoles = null)
    : IRequest<SearchResultResponse>;

public sealed class SearchQueryHandler : IRequestHandler<SearchQuery, SearchResultResponse>
{
    private readonly ISearchProvider _provider;
    private readonly ISearchPermissionProvider _permissionProvider;

    public SearchQueryHandler(ISearchProvider provider, ISearchPermissionProvider permissionProvider)
    {
        _provider = provider;
        _permissionProvider = permissionProvider;
    }

    public async Task<SearchResultResponse> Handle(SearchQuery request, CancellationToken cancellationToken)
    {
        var query = new ProviderSearchQuery
        {
            Query = request.Query,
            Filters = request.Filters ?? Array.Empty<SearchFilter>(),
            Sort = request.Sort ?? Array.Empty<SearchSort>(),
            Pagination = request.Pagination ?? SearchPagination.Create(1, 20),
            IncludeFacets = request.IncludeFacets,
            IncludeHighlights = request.IncludeHighlights,
            IncludeSuggestions = request.IncludeSuggestions,
            Fuzzy = request.Fuzzy,
            HighlightPreTag = request.HighlightPreTag ?? "<mark>",
            HighlightPostTag = request.HighlightPostTag ?? "</mark>",
            UserId = request.UserId,
            UserRoles = request.UserRoles is not null ? request.UserRoles.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList() : new List<string>()
        };

        if (!string.IsNullOrWhiteSpace(request.UserId))
        {
            query.Filters = query.Filters.Concat(await _permissionProvider.GetFiltersForUserAsync(request.UserId, request.UserRoles ?? string.Empty, cancellationToken)).ToList();
        }

        var result = await _provider.SearchAsync(query, cancellationToken);
        return new SearchResultResponse(
            result.Total, result.Page, result.PageSize,
            result.Items.Select(i => new SearchResultItem(i.Id, i.ExternalId, i.SourceType, i.Title, i.Content, i.Url, i.ImageUrl, i.AuthorName, i.Score, i.Highlights)).ToList(),
            result.Facets.Select(f => new SearchFacetResponse(f.FieldName, f.FacetType, f.Values.Select(v => new FacetValue(v.Value, v.Count, v.IsSelected)).ToList())).ToList(),
            result.Highlights.Select(h => new SearchHighlightResponse(h.DocumentId, h.FieldName, h.Fragments)).ToList(),
            result.Suggestions.Select(s => new SearchSuggestionResponse(s.Text, s.Type, s.Weight)).ToList(),
            result.TookMs);
    }
}
