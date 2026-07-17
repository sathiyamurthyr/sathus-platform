using MediatR;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Application.Specifications;
using Sathus.Media.Domain.Exceptions;

namespace Sathus.Media.Application.Commands.DeleteMedia;

public sealed class DeleteMediaCommandHandler : IRequestHandler<DeleteMediaCommand, Unit>
{
    private readonly IMediaRepository _repository;
    private readonly IMediaSearchProvider _search;
    private readonly IMediaAuditService _audit;

    public DeleteMediaCommandHandler(
        IMediaRepository repository,
        IMediaSearchProvider search,
        IMediaAuditService audit)
    {
        _repository = repository;
        _search = search;
        _audit = audit;
    }

    public async Task<Unit> Handle(DeleteMediaCommand request, CancellationToken cancellationToken)
    {
        var asset = await _repository.GetSingleAsync(new MediaAssetDetailSpecification(request.Id), cancellationToken)
                   ?? throw new MediaAssetNotFoundException(request.Id);

        asset.Delete(request.ActorId);

        await _repository.UpdateAsync(asset, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        await _search.RemoveAsync(asset.Id, cancellationToken);

        await _audit.LogAsync(new MediaAuditEntry(
            "MediaDeleted", asset.Id, request.ActorId, "Soft-deleted asset."), cancellationToken);

        return Unit.Value;
    }
}
