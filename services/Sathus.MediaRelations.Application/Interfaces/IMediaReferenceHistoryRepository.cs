using Sathus.MediaRelations.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.MediaRelations.Application.Interfaces;

public interface IMediaReferenceHistoryRepository : IRepository<MediaReferenceHistory>
{
    Task<IReadOnlyList<MediaReferenceHistory>> GetByReferenceIdAsync(Guid referenceId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaReferenceHistory>> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);
}
