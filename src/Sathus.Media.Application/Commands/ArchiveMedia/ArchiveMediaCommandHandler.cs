using MediatR;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Application.Specifications;
using Sathus.Media.Domain.Exceptions;

namespace Sathus.Media.Application.Commands.ArchiveMedia;

public sealed class ArchiveMediaCommandHandler : IRequestHandler<ArchiveMediaCommand, Unit>
{
    private readonly IMediaRepository _repository;
    private readonly IMediaAuditService _audit;

    public ArchiveMediaCommandHandler(IMediaRepository repository, IMediaAuditService audit)
    {
        _repository = repository;
        _audit = audit;
    }

    public async Task<Unit> Handle(ArchiveMediaCommand request, CancellationToken cancellationToken)
    {
        var asset = await _repository.GetSingleAsync(new MediaAssetDetailSpecification(request.Id), cancellationToken)
                   ?? throw new MediaAssetNotFoundException(request.Id);

        asset.Archive(request.ActorId);

        await _repository.UpdateAsync(asset, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        await _audit.LogAsync(new MediaAuditEntry(
            "MediaArchived", asset.Id, request.ActorId, "Archived asset."), cancellationToken);

        return Unit.Value;
    }
}
