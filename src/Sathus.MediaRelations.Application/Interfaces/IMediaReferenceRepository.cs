using Sathus.MediaRelations.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.MediaRelations.Application.Interfaces;

/// <summary>
/// Persistence contract for <see cref="MediaReference"/> aggregates. Query methods are
/// designed to avoid N+1 access and to scale to millions of relationships.
/// </summary>
public interface IMediaReferenceRepository : IRepository<MediaReference>
{
    Task<IReadOnlyList<MediaReference>> GetByAssetIdAsync(Guid assetId, bool includeInactive = false, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaReference>> GetBySourceAsync(string referenceType, string referenceId, CancellationToken cancellationToken = default);

    Task<MediaReference?> GetByDeduplicationKeyAsync(string deduplicationKey, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaReference>> GetBrokenAsync(int skip, int take, CancellationToken cancellationToken = default);

    Task<int> CountActiveByAssetAsync(Guid assetId, CancellationToken cancellationToken = default);

    Task<int> CountBlockingByAssetAsync(Guid assetId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Guid>> GetDistinctAssetIdsAsync(int skip, int take, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaReference>> GetActiveBatchAsync(int skip, int take, CancellationToken cancellationToken = default);
}
