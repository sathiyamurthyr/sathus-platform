using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;

namespace Sathus.MediaRelations.Application.Commands.ValidateReference;

public sealed class ValidateAssetReferencesCommandHandler
    : IRequestHandler<ValidateAssetReferencesCommand, ReferenceValidationResponse>
{
    private readonly IMediaReferenceRepository _references;
    private readonly IMediaReferenceHistoryRepository _history;
    private readonly IAssetExistenceChecker _assetChecker;
    private readonly IUsageGraphCache _graphCache;

    public ValidateAssetReferencesCommandHandler(
        IMediaReferenceRepository references,
        IMediaReferenceHistoryRepository history,
        IAssetExistenceChecker assetChecker,
        IUsageGraphCache graphCache)
    {
        _references = references;
        _history = history;
        _assetChecker = assetChecker;
        _graphCache = graphCache;
    }

    public async Task<ReferenceValidationResponse> Handle(ValidateAssetReferencesCommand request, CancellationToken cancellationToken)
    {
        var references = await _references.GetByAssetIdAsync(request.AssetId, includeInactive: true, cancellationToken);
        var assetExists = await _assetChecker.ExistsAsync(request.AssetId, cancellationToken);

        var affected = new List<MediaReference>();
        var broken = 0;
        var restored = 0;
        var valid = 0;

        foreach (var reference in references)
        {
            if (reference.Status == ReferenceStatus.Removed)
            {
                continue;
            }

            if (!assetExists)
            {
                if (reference.Status != ReferenceStatus.Broken)
                {
                    reference.MarkBroken("Referenced asset no longer exists.", request.ActorId);
                    await _references.UpdateAsync(reference, cancellationToken);
                    await _history.AddAsync(
                        MediaReferenceHistory.FromReference(reference, ReferenceHistoryAction.Broken, "Asset missing during validation.", request.ActorId),
                        cancellationToken);
                    affected.Add(reference);
                    broken++;
                }
            }
            else
            {
                var wasBroken = reference.Status == ReferenceStatus.Broken;
                reference.MarkValid(request.ActorId);
                await _references.UpdateAsync(reference, cancellationToken);
                await _history.AddAsync(
                    MediaReferenceHistory.FromReference(reference, wasBroken ? ReferenceHistoryAction.Restored : ReferenceHistoryAction.Validated, "Validated against asset store.", request.ActorId),
                    cancellationToken);

                if (wasBroken)
                {
                    restored++;
                    affected.Add(reference);
                }

                valid++;
            }
        }

        await _references.SaveChangesAsync(cancellationToken);
        await _graphCache.InvalidateAsync(request.AssetId, cancellationToken);

        return new ReferenceValidationResponse(
            request.AssetId,
            assetExists,
            references.Count(r => r.Status != ReferenceStatus.Removed),
            valid,
            broken,
            restored,
            affected.Select(MediaReferenceResponse.From).ToList());
    }
}
