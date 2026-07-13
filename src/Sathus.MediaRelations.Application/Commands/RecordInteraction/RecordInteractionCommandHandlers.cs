using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Application.Commands.RecordInteraction;

public sealed class RecordAssetViewCommandHandler : IRequestHandler<RecordAssetViewCommand, UsageStatisticsResponse>
{
    private readonly IMediaUsageStatisticsRepository _statistics;

    public RecordAssetViewCommandHandler(IMediaUsageStatisticsRepository statistics)
    {
        _statistics = statistics;
    }

    public async Task<UsageStatisticsResponse> Handle(RecordAssetViewCommand request, CancellationToken cancellationToken)
    {
        var (stats, created) = await GetOrCreateAsync(_statistics, request.AssetId, request.ActorId, cancellationToken);
        stats.RecordView(request.Amount, request.ActorId);
        if (!created)
        {
            await _statistics.UpdateAsync(stats, cancellationToken);
        }

        await _statistics.SaveChangesAsync(cancellationToken);
        return UsageStatisticsResponse.From(stats);
    }

    internal static async Task<(MediaUsageStatistics Stats, bool Created)> GetOrCreateAsync(
        IMediaUsageStatisticsRepository repository,
        Guid assetId,
        Guid? actorId,
        CancellationToken cancellationToken)
    {
        var stats = await repository.GetByAssetIdAsync(assetId, cancellationToken);
        if (stats is null)
        {
            stats = new MediaUsageStatistics(assetId, null, actorId);
            await repository.AddAsync(stats, cancellationToken);
            return (stats, true);
        }

        return (stats, false);
    }
}

public sealed class RecordAssetDownloadCommandHandler : IRequestHandler<RecordAssetDownloadCommand, UsageStatisticsResponse>
{
    private readonly IMediaUsageStatisticsRepository _statistics;

    public RecordAssetDownloadCommandHandler(IMediaUsageStatisticsRepository statistics)
    {
        _statistics = statistics;
    }

    public async Task<UsageStatisticsResponse> Handle(RecordAssetDownloadCommand request, CancellationToken cancellationToken)
    {
        var (stats, created) = await RecordAssetViewCommandHandler.GetOrCreateAsync(_statistics, request.AssetId, request.ActorId, cancellationToken);
        stats.RecordDownload(request.Amount, request.ActorId);
        if (!created)
        {
            await _statistics.UpdateAsync(stats, cancellationToken);
        }

        await _statistics.SaveChangesAsync(cancellationToken);
        return UsageStatisticsResponse.From(stats);
    }
}
