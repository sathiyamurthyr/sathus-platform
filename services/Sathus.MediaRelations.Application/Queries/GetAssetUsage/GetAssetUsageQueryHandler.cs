using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Enums;

namespace Sathus.MediaRelations.Application.Queries.GetAssetUsage;

public sealed class GetAssetUsageQueryHandler : IRequestHandler<GetAssetUsageQuery, AssetUsageResponse>
{
    private readonly IMediaReferenceRepository _references;
    private readonly IMediaUsageStatisticsRepository _statistics;

    public GetAssetUsageQueryHandler(
        IMediaReferenceRepository references,
        IMediaUsageStatisticsRepository statistics)
    {
        _references = references;
        _statistics = statistics;
    }

    public async Task<AssetUsageResponse> Handle(GetAssetUsageQuery request, CancellationToken cancellationToken)
    {
        var references = await _references.GetByAssetIdAsync(request.AssetId, includeInactive: true, cancellationToken);
        var stats = await _statistics.GetByAssetIdAsync(request.AssetId, cancellationToken);

        var active = references.Count(r => r.Status == ReferenceStatus.Active);
        var brokenCount = references.Count(r => r.Status == ReferenceStatus.Broken);

        var visible = references
            .Where(r => r.Status != ReferenceStatus.Removed)
            .Select(MediaReferenceResponse.From)
            .ToList();

        return new AssetUsageResponse(
            request.AssetId,
            active,
            brokenCount,
            stats?.UsageCount ?? active,
            stats?.ViewCount ?? 0,
            stats?.DownloadCount ?? 0,
            stats?.LastUsedAt,
            stats?.UnusedSince,
            active == 0,
            visible);
    }
}
