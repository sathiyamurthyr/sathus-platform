using Sathus.MediaRelations.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.MediaRelations.Application.Interfaces;

public interface IMediaReferenceSnapshotRepository : IRepository<MediaReferenceSnapshot>
{
    Task<IReadOnlyList<MediaReferenceSnapshot>> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);

    Task<MediaReferenceSnapshot?> GetLatestAsync(Guid assetId, CancellationToken cancellationToken = default);
}
