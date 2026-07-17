using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Application.DTOs;

/// <summary>Aggregated usage report for a single asset.</summary>
public sealed record AssetUsageResponse(
    Guid AssetId,
    int ActiveReferenceCount,
    int BrokenReferenceCount,
    long UsageCount,
    long ViewCount,
    long DownloadCount,
    DateTime? LastUsedAt,
    DateTime? UnusedSince,
    bool IsOrphan,
    IReadOnlyList<MediaReferenceResponse> References);
