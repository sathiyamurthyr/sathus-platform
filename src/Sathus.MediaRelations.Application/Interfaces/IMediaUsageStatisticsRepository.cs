using Sathus.MediaRelations.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.MediaRelations.Application.Interfaces;

public interface IMediaUsageStatisticsRepository : IRepository<MediaUsageStatistics>
{
    Task<MediaUsageStatistics?> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaUsageStatistics>> GetMostUsedAsync(int take, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaUsageStatistics>> GetUnusedAsync(int skip, int take, CancellationToken cancellationToken = default);
}
