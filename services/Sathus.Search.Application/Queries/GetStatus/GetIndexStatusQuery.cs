using MediatR;

namespace Sathus.Search.Application.Queries.GetStatus;

public sealed record GetIndexStatusQuery(Guid? IndexId = null) : IRequest<IReadOnlyList<SearchIndexStatusResponse>>;

public sealed class GetIndexStatusQueryHandler : IRequestHandler<GetIndexStatusQuery, IReadOnlyList<SearchIndexStatusResponse>>
{
    private readonly ISearchRepository _repository;

    public GetIndexStatusQueryHandler(ISearchRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<SearchIndexStatusResponse>> Handle(GetIndexStatusQuery request, CancellationToken cancellationToken)
    {
        if (request.IndexId.HasValue)
        {
            var index = await _repository.GetIndexWithDocumentsAsync(request.IndexId.Value, cancellationToken);
            if (index is null) return Array.Empty<SearchIndexStatusResponse>();
            var count = (await _repository.GetByIndexAsync(index.Id, cancellationToken)).Count;
            return new[] { new SearchIndexStatusResponse(index.Id, index.Code, index.Name, index.IsEnabled, index.LastBuiltAt, count) };
        }

        var all = await _repository.GetAllAsync(cancellationToken);
        var results = new List<SearchIndexStatusResponse>();
        foreach (var index in all)
        {
            var count = (await _repository.GetByIndexAsync(index.Id, cancellationToken)).Count;
            results.Add(new SearchIndexStatusResponse(index.Id, index.Code, index.Name, index.IsEnabled, index.LastBuiltAt, count));
        }
        return results;
    }
}
