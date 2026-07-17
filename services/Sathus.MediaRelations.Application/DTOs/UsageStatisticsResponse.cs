using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Application.DTOs;

public sealed record UsageStatisticsResponse(
    Guid AssetId,
    long UsageCount,
    long DownloadCount,
    long ViewCount,
    int ReferenceCount,
    DateTime? LastUsedAt,
    DateTime? UnusedSince,
    bool IsUnused)
{
    public static UsageStatisticsResponse From(MediaUsageStatistics stats) => new(
        stats.AssetId,
        stats.UsageCount,
        stats.DownloadCount,
        stats.ViewCount,
        stats.ReferenceCount,
        stats.LastUsedAt,
        stats.UnusedSince,
        stats.IsUnused);
}
