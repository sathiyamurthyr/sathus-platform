using MediatR;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;
using Sathus.MediaRelations.Domain.Exceptions;

namespace Sathus.MediaRelations.Application.Commands.RemoveReference;

public sealed class RemoveReferenceCommandHandler : IRequestHandler<RemoveReferenceCommand, Unit>
{
    private readonly IMediaReferenceRepository _references;
    private readonly IMediaUsageRepository _usages;
    private readonly IMediaUsageStatisticsRepository _statistics;
    private readonly IMediaReferenceHistoryRepository _history;
    private readonly IUsageGraphCache _graphCache;

    public RemoveReferenceCommandHandler(
        IMediaReferenceRepository references,
        IMediaUsageRepository usages,
        IMediaUsageStatisticsRepository statistics,
        IMediaReferenceHistoryRepository history,
        IUsageGraphCache graphCache)
    {
        _references = references;
        _usages = usages;
        _statistics = statistics;
        _history = history;
        _graphCache = graphCache;
    }

    public async Task<Unit> Handle(RemoveReferenceCommand request, CancellationToken cancellationToken)
    {
        var reference = await _references.GetByIdAsync(request.ReferenceId, cancellationToken)
            ?? throw new MediaReferenceNotFoundException(request.ReferenceId);

        if (reference.Status == ReferenceStatus.Removed)
        {
            return Unit.Value;
        }

        reference.Remove(request.ActorId);
        await _references.UpdateAsync(reference, cancellationToken);
        await _history.AddAsync(
            MediaReferenceHistory.FromReference(reference, ReferenceHistoryAction.Removed, "Reference removed.", request.ActorId),
            cancellationToken);

        var usageKey = $"{reference.AssetId:N}|{reference.Module.ToLowerInvariant()}|{reference.ReferenceType.Value}|{reference.SourceReferenceId.Value}";
        var usage = await _usages.GetByKeyAsync(usageKey, cancellationToken);
        if (usage is not null)
        {
            usage.RemoveReference(request.ActorId);
            await _usages.UpdateAsync(usage, cancellationToken);
        }

        var stats = await _statistics.GetByAssetIdAsync(reference.AssetId, cancellationToken);
        if (stats is not null)
        {
            stats.RecordReferenceRemoved(request.ActorId);
            await _statistics.UpdateAsync(stats, cancellationToken);
        }

        await _references.SaveChangesAsync(cancellationToken);
        await _graphCache.InvalidateAsync(reference.AssetId, cancellationToken);

        return Unit.Value;
    }
}
