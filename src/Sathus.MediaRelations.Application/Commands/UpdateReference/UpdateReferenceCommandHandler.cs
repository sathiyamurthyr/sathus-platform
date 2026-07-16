using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;
using Sathus.MediaRelations.Domain.Exceptions;
using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Application.Commands.UpdateReference;

public sealed class UpdateReferenceCommandHandler : IRequestHandler<UpdateReferenceCommand, MediaReferenceResponse>
{
    private readonly IMediaReferenceRepository _references;
    private readonly IMediaReferenceHistoryRepository _history;
    private readonly IUsageGraphCache _graphCache;

    public UpdateReferenceCommandHandler(
        IMediaReferenceRepository references,
        IMediaReferenceHistoryRepository history,
        IUsageGraphCache graphCache)
    {
        _references = references;
        _history = history;
        _graphCache = graphCache;
    }

    public async Task<MediaReferenceResponse> Handle(UpdateReferenceCommand request, CancellationToken cancellationToken)
    {
        var reference = await _references.GetByIdAsync(request.ReferenceId, cancellationToken)
            ?? throw new MediaReferenceNotFoundException(request.ReferenceId);

        if (request.NewAssetId is { } newAssetId && newAssetId != reference.AssetId)
        {
            reference.Retarget(newAssetId, request.ActorId);
        }

        if (request.Title is not null || request.Url is not null || request.Path is not null)
        {
            var path = request.Path is null ? null : ReferencePath.Create(request.Path);
            reference.UpdatePlacement(request.Title ?? reference.Title, request.Url ?? reference.Url, path, request.ActorId);
        }

        if (request.Scope is not null)
        {
            var scope = ReferenceScope.Create(request.Scope);
            reference.ChangeScope(scope, request.ScheduledFor, request.ActorId);
        }

        await _references.UpdateAsync(reference, cancellationToken);
        await _history.AddAsync(
            MediaReferenceHistory.FromReference(reference, ReferenceHistoryAction.Updated, "Reference updated.", request.ActorId),
            cancellationToken);

        await _references.SaveChangesAsync(cancellationToken);
        await _graphCache.InvalidateAsync(reference.AssetId, cancellationToken);

        return MediaReferenceResponse.From(reference);
    }
}
