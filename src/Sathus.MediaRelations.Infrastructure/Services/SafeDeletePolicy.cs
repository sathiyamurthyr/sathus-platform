using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Enums;
using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Infrastructure.Services;

/// <summary>
/// Default safe-delete policy. Inspects current usage, historical usage, dependencies,
/// active references and published/scheduled content, blocking deletion when active
/// references exist unless force-delete is explicitly requested.
/// </summary>
public sealed class SafeDeletePolicy : ISafeDeletePolicy
{
    private readonly IMediaReferenceRepository _references;
    private readonly IMediaUsageStatisticsRepository _statistics;
    private readonly IUsageGraphBuilder _graphBuilder;

    public SafeDeletePolicy(
        IMediaReferenceRepository references,
        IMediaUsageStatisticsRepository statistics,
        IUsageGraphBuilder graphBuilder)
    {
        _references = references;
        _statistics = statistics;
        _graphBuilder = graphBuilder;
    }

    public async Task<SafeDeleteEvaluation> EvaluateAsync(Guid assetId, bool forceDelete = false, CancellationToken cancellationToken = default)
    {
        var references = await _references.GetByAssetIdAsync(assetId, includeInactive: true, cancellationToken);
        var active = references.Where(r => r.Status == ReferenceStatus.Active).ToList();

        var publishedCount = active.Count(r => r.Scope.Value == ReferenceScope.PublishedValue);
        var scheduledCount = active.Count(r => r.Scope.Value == ReferenceScope.ScheduledValue);
        var blockingCount = active.Count(r => r.IsBlockingDeletion);

        var stats = await _statistics.GetByAssetIdAsync(assetId, cancellationToken);
        var historicalUsage = stats?.UsageCount ?? active.Count;

        var graph = await _graphBuilder.BuildAsync(assetId, cancellationToken: cancellationToken);
        var dependentCount = graph.GetDependents().Count;

        var reasons = new List<string>();
        if (active.Count > 0)
        {
            reasons.Add($"{active.Count} active reference(s) exist.");
        }

        if (publishedCount > 0)
        {
            reasons.Add($"{publishedCount} published content reference(s) exist.");
        }

        if (scheduledCount > 0)
        {
            reasons.Add($"{scheduledCount} scheduled content reference(s) exist.");
        }

        if (dependentCount > 0)
        {
            reasons.Add($"{dependentCount} dependent node(s) rely on this asset.");
        }

        var wouldBlock = active.Count > 0;
        var canDelete = forceDelete || !wouldBlock;

        return new SafeDeleteEvaluation(
            assetId,
            canDelete,
            forceDelete && wouldBlock,
            active.Count,
            blockingCount,
            publishedCount,
            scheduledCount,
            dependentCount,
            historicalUsage,
            reasons);
    }
}
