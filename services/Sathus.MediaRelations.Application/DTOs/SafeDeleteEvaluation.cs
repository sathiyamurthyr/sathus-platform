namespace Sathus.MediaRelations.Application.DTOs;

/// <summary>The outcome of a safe-delete evaluation for an asset.</summary>
public sealed record SafeDeleteEvaluation(
    Guid AssetId,
    bool CanDelete,
    bool ForceApplied,
    int ActiveReferenceCount,
    int BlockingReferenceCount,
    int PublishedReferenceCount,
    int ScheduledReferenceCount,
    int DependentCount,
    long HistoricalUsageCount,
    IReadOnlyList<string> Reasons);
