using MediatR;
using Sathus.Search.Application.Interfaces;
using Sathus.Search.Domain.Entities;

namespace Sathus.Search.Application.Queries.Suggest;

public sealed record SuggestQuery(string Query, Guid? IndexId = null, string? DocumentType = null, int Limit = 8) : IRequest<IReadOnlyList<SearchSuggestionResponse>>;

public sealed class SuggestQueryHandler : IRequestHandler<SuggestQuery, IReadOnlyList<SearchSuggestionResponse>>
{
    private readonly ISearchProvider _provider;

    public SuggestQueryHandler(ISearchProvider provider) => _provider = provider;

    public async Task<IReadOnlyList<SearchSuggestionResponse>> Handle(SuggestQuery request, CancellationToken cancellationToken)
    {
        var suggestions = string.IsNullOrEmpty(request.Query)
            ? Array.Empty<ProviderSearchSuggestion>()
            : await _provider.GetSuggestionsAsync(request.Query, request.DocumentType, cancellationToken);

        return suggestions.Take(request.Limit).Select(s => new SearchSuggestionResponse(s.Text, s.Type, s.Weight)).ToList();
    }
}
