using Sathus.MediaRelations.Domain.Enums;

namespace Sathus.MediaRelations.Application.DTOs;

/// <summary>Options controlling a reference scan run.</summary>
public sealed record ReferenceScanOptions(
    bool DetectBroken = true,
    bool DetectMissingAssets = true,
    bool DetectOrphans = true,
    bool DetectUnused = true,
    bool DetectDuplicates = true,
    bool DetectCircular = true,
    bool AutoRepair = true,
    int BatchSize = 500,
    IReadOnlyCollection<Guid>? KnownAssetIds = null)
{
    public static ReferenceScanOptions Default => new();
}

/// <summary>A single anomaly discovered by the scanner.</summary>
public sealed record ReferenceScanIssue(
    ScannerIssueType Type,
    Guid? AssetId,
    Guid? ReferenceId,
    string Description);

/// <summary>Summary of a completed scan run.</summary>
public sealed record ReferenceScanReport(
    DateTime StartedAt,
    DateTime CompletedAt,
    int ReferencesScanned,
    int AssetsScanned,
    int BrokenRepaired,
    IReadOnlyList<ReferenceScanIssue> Issues)
{
    public int TotalIssues => Issues.Count;

    public IReadOnlyDictionary<ScannerIssueType, int> IssueCountsByType =>
        Issues.GroupBy(i => i.Type).ToDictionary(g => g.Key, g => g.Count());
}
