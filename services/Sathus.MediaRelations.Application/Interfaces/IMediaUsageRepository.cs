using Sathus.MediaRelations.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.MediaRelations.Application.Interfaces;

public interface IMediaUsageRepository : IRepository<MediaUsage>
{
    Task<MediaUsage?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaUsage>> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);
}
