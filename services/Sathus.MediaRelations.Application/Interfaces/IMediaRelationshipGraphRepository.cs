using Sathus.MediaRelations.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.MediaRelations.Application.Interfaces;

public interface IMediaRelationshipGraphRepository : IRepository<MediaRelationshipGraph>
{
    Task<MediaRelationshipGraph?> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);

    Task RemoveByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);
}
