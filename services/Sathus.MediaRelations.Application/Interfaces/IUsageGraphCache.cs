using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Application.Interfaces;

/// <summary>
/// In-memory / distributed cache for materialised usage graphs. Enables incremental
/// invalidation whenever an asset's references change.
/// </summary>
public interface IUsageGraphCache
{
    Task<MediaRelationshipGraph?> GetAsync(Guid assetId, CancellationToken cancellationToken = default);

    Task SetAsync(MediaRelationshipGraph graph, CancellationToken cancellationToken = default);

    Task InvalidateAsync(Guid assetId, CancellationToken cancellationToken = default);
}
