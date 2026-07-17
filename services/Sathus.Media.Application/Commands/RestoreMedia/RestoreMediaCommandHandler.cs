using MediatR;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Application.Specifications;
using Sathus.Media.Domain.Exceptions;

namespace Sathus.Media.Application.Commands.RestoreMedia;

public sealed class RestoreMediaCommandHandler : IRequestHandler<RestoreMediaCommand, Unit>
{
    private readonly IMediaRepository _repository;
    private readonly IMediaAuditService _audit;

    public RestoreMediaCommandHandler(IMediaRepository repository, IMediaAuditService audit)
    {
        _repository = repository;
        _audit = audit;
    }

    public async Task<Unit> Handle(RestoreMediaCommand request, CancellationToken cancellationToken)
    {
        var asset = await _repository.GetSingleAsync(new MediaAssetDetailSpecification(request.Id), cancellationToken)
                   ?? throw new MediaAssetNotFoundException(request.Id);

        asset.Restore(request.ActorId);

        await _repository.UpdateAsync(asset, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        await _audit.LogAsync(new MediaAuditEntry(
            "MediaRestored", asset.Id, request.ActorId, "Restored asset."), cancellationToken);

        return Unit.Value;
    }
}
