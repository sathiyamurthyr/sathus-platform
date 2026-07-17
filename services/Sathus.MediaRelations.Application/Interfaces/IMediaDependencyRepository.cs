using Sathus.MediaRelations.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.MediaRelations.Application.Interfaces;

public interface IMediaDependencyRepository : IRepository<MediaDependency>
{
    Task<IReadOnlyList<MediaDependency>> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);

    Task RemoveByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);
}
