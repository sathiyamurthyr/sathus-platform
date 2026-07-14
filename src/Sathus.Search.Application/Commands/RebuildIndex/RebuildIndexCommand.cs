using MediatR;
using Sathus.Search.Application.Interfaces;

namespace Sathus.Search.Application.Commands.RebuildIndex;

public sealed record RebuildIndexCommand(Guid IndexId, Guid? ActorId = null) : IRequest<RebuildIndexResponse>;

public sealed class RebuildIndexCommandHandler : IRequestHandler<RebuildIndexCommand, RebuildIndexResponse>
{
    private readonly ISearchRepository _repository;
    private readonly ISearchProvider _provider;

    public RebuildIndexCommandHandler(ISearchRepository repository, ISearchProvider provider)
    {
        _repository = repository;
        _provider = provider;
    }

    public async Task<RebuildIndexResponse> Handle(RebuildIndexCommand request, CancellationToken cancellationToken)
    {
        var index = await _repository.GetIndexWithDocumentsAsync(request.IndexId, cancellationToken)
            ?? throw new SearchIndexNotFoundException(request.IndexId);

        var documents = await _repository.GetAllAsync(cancellationToken);
        await _provider.RebuildIndexAsync(index, cancellationToken);

        index.RecordRebuild(DateTime.UtcNow, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        return new RebuildIndexResponse(index.Id, index.Code, documents.Count, DateTime.UtcNow, "completed");
    }
}
