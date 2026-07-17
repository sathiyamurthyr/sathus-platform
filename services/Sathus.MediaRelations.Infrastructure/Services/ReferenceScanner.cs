using Microsoft.Extensions.Logging;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;

namespace Sathus.MediaRelations.Infrastructure.Services;

/// <summary>
/// Scans the reference index for anomalies: broken references, missing assets, orphan and
/// unused assets, duplicate references and circular references. Optionally auto-repairs
/// broken references by marking them broken and recording history.
/// </summary>
public sealed class ReferenceScanner : IReferenceScanner
{
    private readonly IMediaReferenceRepository _references;
    private readonly IMediaReferenceHistoryRepository _history;
    private readonly IAssetExistenceChecker _assetChecker;
    private readonly IUsageGraphBuilder _graphBuilder;
    private readonly IUsageGraphCache _graphCache;
    private readonly ILogger<ReferenceScanner> _logger;

    public ReferenceScanner(
        IMediaReferenceRepository references,
        IMediaReferenceHistoryRepository history,
        IAssetExistenceChecker assetChecker,
        IUsageGraphBuilder graphBuilder,
        IUsageGraphCache graphCache,
        ILogger<ReferenceScanner> logger)
    {
        _references = references;
        _history = history;
        _assetChecker = assetChecker;
        _graphBuilder = graphBuilder;
        _graphCache = graphCache;
        _logger = logger;
    }

    public async Task<ReferenceScanReport> ScanAsync(ReferenceScanOptions options, CancellationToken cancellationToken = default)
    {
        var startedAt = DateTime.UtcNow;
        var issues = new List<ReferenceScanIssue>();
        var referencedAssets = new HashSet<Guid>();
        var referencesScanned = 0;
        var assetsScanned = 0;
        var brokenRepaired = 0;
        var batchSize = options.BatchSize <= 0 ? 500 : options.BatchSize;

        var skip = 0;
        while (!cancellationToken.IsCancellationRequested)
        {
            var assetIds = await _references.GetDistinctAssetIdsAsync(skip, batchSize, cancellationToken);
            if (assetIds.Count == 0)
            {
                break;
            }

            var existing = await _assetChecker.ExistingAsync(assetIds, cancellationToken);
            var repairedInBatch = false;

            foreach (var assetId in assetIds)
            {
                assetsScanned++;
                var refs = await _references.GetByAssetIdAsync(assetId, includeInactive: true, cancellationToken);
                referencesScanned += refs.Count;

                var active = refs.Where(r => r.Status == ReferenceStatus.Active).ToList();
                if (active.Count > 0)
                {
                    referencedAssets.Add(assetId);
                }

                var assetExists = existing.Contains(assetId);

                if (options.DetectMissingAssets && !assetExists && active.Count > 0)
                {
                    issues.Add(new ReferenceScanIssue(ScannerIssueType.MissingAsset, assetId, null,
                        $"Asset {assetId} is referenced by {active.Count} active reference(s) but does not exist."));
                }

                if (options.DetectBroken && !assetExists)
                {
                    foreach (var reference in active)
                    {
                        issues.Add(new ReferenceScanIssue(ScannerIssueType.BrokenReference, assetId, reference.Id,
                            $"Reference {reference.Id} points at missing asset {assetId}."));

                        if (options.AutoRepair)
                        {
                            reference.MarkBroken("Detected by scanner: asset missing.");
                            await _references.UpdateAsync(reference, cancellationToken);
                            await _history.AddAsync(
                                MediaReferenceHistory.FromReference(reference, ReferenceHistoryAction.Broken, "Scanner auto-repair."),
                                cancellationToken);
                            brokenRepaired++;
                            repairedInBatch = true;
                        }
                    }
                }

                if (options.DetectDuplicates)
                {
                    foreach (var group in active.GroupBy(r => r.DeduplicationKey).Where(g => g.Count() > 1))
                    {
                        issues.Add(new ReferenceScanIssue(ScannerIssueType.DuplicateReference, assetId, group.First().Id,
                            $"{group.Count()} duplicate references share key '{group.Key}'."));
                    }
                }

                if (options.DetectUnused && active.Count == 0 && refs.Count > 0)
                {
                    issues.Add(new ReferenceScanIssue(ScannerIssueType.UnusedAsset, assetId, null,
                        $"Asset {assetId} has {refs.Count} reference(s) but none are active."));
                }

                if (options.DetectCircular && active.Count > 0)
                {
                    var graph = await _graphBuilder.BuildAsync(assetId, cancellationToken: cancellationToken);
                    if (graph.HasCycle)
                    {
                        issues.Add(new ReferenceScanIssue(ScannerIssueType.CircularReference, assetId, null,
                            $"Circular reference detected in usage graph rooted at {assetId}."));
                    }
                }
            }

            if (repairedInBatch)
            {
                await _references.SaveChangesAsync(cancellationToken);
                foreach (var assetId in assetIds)
                {
                    await _graphCache.InvalidateAsync(assetId, cancellationToken);
                }
            }

            skip += batchSize;
        }

        if (options.DetectOrphans && options.KnownAssetIds is { Count: > 0 })
        {
            var existingKnown = await _assetChecker.ExistingAsync(options.KnownAssetIds, cancellationToken);
            foreach (var assetId in options.KnownAssetIds.Distinct())
            {
                if (existingKnown.Contains(assetId) && !referencedAssets.Contains(assetId))
                {
                    issues.Add(new ReferenceScanIssue(ScannerIssueType.OrphanAsset, assetId, null,
                        $"Asset {assetId} exists but has no active references."));
                }
            }
        }

        var report = new ReferenceScanReport(startedAt, DateTime.UtcNow, referencesScanned, assetsScanned, brokenRepaired, issues);
        _logger.LogInformation(
            "Reference scan completed: {References} references / {Assets} assets scanned, {Issues} issue(s), {Repaired} repaired.",
            referencesScanned, assetsScanned, issues.Count, brokenRepaired);

        return report;
    }
}
