using Sathus.Media.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Media.Application.Interfaces;

public interface IMediaUsageRepository : IRepository<MediaUsage>
{
    Task<IReadOnlyList<MediaUsage>> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaUsage>> GetByContextAsync(string context, CancellationToken cancellationToken = default);
}
