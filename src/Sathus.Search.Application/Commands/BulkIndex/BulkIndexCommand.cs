using MediatR;

namespace Sathus.Search.Application.Commands.BulkIndex;

public sealed record BulkIndexCommand(Guid IndexId, IReadOnlyList<BulkIndexItem> Items, Guid? ActorId = null) : IRequest<BulkIndexResponse>;

public sealed record BulkIndexItem(string ExternalId, IndexSourceType SourceType, string Title, string Content, string? Url = null, string? ImageUrl = null, Guid? AuthorId = null, string? AuthorName = null, string Language = "en", string? Metadata = null);

public sealed class BulkIndexCommandHandler : IRequestHandler<BulkIndexCommand, BulkIndexResponse>
{
    private readonly ISearchRepository _repository;

    public BulkIndexCommandHandler(ISearchRepository repository) => _repository = repository;

    public async Task<BulkIndexResponse> Handle(BulkIndexCommand request, CancellationToken cancellationToken)
    {
        var indexed = 0;
        var failed = 0;

        foreach (var item in request.Items)
        {
            try
            {
                var cmd = new IndexDocumentCommand(request.IndexId, item.ExternalId, item.SourceType, item.Title, item.Content, item.Url, item.ImageUrl, item.AuthorId, item.AuthorName, item.Language, item.Metadata, false, null, null, PermissionScope.Public, null, null, request.ActorId);
                await new IndexDocumentCommandHandler(_repository).Handle(cmd, cancellationToken);
                indexed++;
            }
            catch
            {
                failed++;
            }
        }

        return new BulkIndexResponse(request.IndexId, indexed, failed, DateTime.UtcNow);
    }
}
