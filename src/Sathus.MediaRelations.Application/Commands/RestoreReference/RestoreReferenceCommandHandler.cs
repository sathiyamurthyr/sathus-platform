using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;
using Sathus.MediaRelations.Domain.Exceptions;

namespace Sathus.MediaRelations.Application.Commands.RestoreReference;

public sealed class RestoreReferenceCommandHandler : IRequestHandler<RestoreReferenceCommand, MediaReferenceResponse>
{
    private readonly IMediaReferenceRepository _references;
    private readonly IMediaUsageStatisticsRepository _statistics;
    private readonly IMediaReferenceHistoryRepository _history;
    private readonly IUsageGraphCache _graphCache;

    public RestoreReferenceCommandHandler(
        IMediaReferenceRepository references,
        IMediaUsageStatisticsRepository statistics,
        IMediaReferenceHistoryRepository history,
        IUsageGraphCache graphCache)
    {
        _references = references;
        _statistics = statistics;
        _history = history;
        _graphCache = graphCache;
    }

    public async Task<MediaReferenceResponse> Handle(RestoreReferenceCommand request, CancellationToken cancellationToken)
    {
        var reference = await _references.GetByIdAsync(request.ReferenceId, cancellationToken)
            ?? throw new MediaReferenceNotFoundException(request.ReferenceId);

        if (reference.Status == ReferenceStatus.Active)
        {
            return MediaReferenceResponse.From(reference);
        }

        var wasRemoved = reference.Status == ReferenceStatus.Removed;
        reference.Restore(request.ActorId);
        await _references.UpdateAsync(reference, cancellationToken);
        await _history.AddAsync(
            MediaReferenceHistory.FromReference(reference, ReferenceHistoryAction.Restored, "Reference restored.", request.ActorId),
            cancellationToken);

        if (wasRemoved)
        {
            var stats = await _statistics.GetByAssetIdAsync(reference.AssetId, cancellationToken);
            if (stats is null)
            {
                stats = new MediaUsageStatistics(reference.AssetId, reference.TenantId, request.ActorId);
                await _statistics.AddAsync(stats, cancellationToken);
            }

            stats.RecordReferenceAdded(request.ActorId);
            await _statistics.UpdateAsync(stats, cancellationToken);
        }

        await _references.SaveChangesAsync(cancellationToken);
        await _graphCache.InvalidateAsync(reference.AssetId, cancellationToken);

        return MediaReferenceResponse.From(reference);
    }
}
