using Sathus.MediaRelations.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.MediaRelations.Application.Interfaces;

public interface IMediaRelationRepository : IRepository<MediaRelation>
{
    Task<IReadOnlyList<MediaRelation>> GetByTargetNodeAsync(string targetNodeKey, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaRelation>> GetBySourceNodeAsync(string sourceNodeKey, CancellationToken cancellationToken = default);

    Task<MediaRelation?> GetByDeduplicationKeyAsync(string deduplicationKey, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaRelation>> GetAllEdgesAsync(CancellationToken cancellationToken = default);
}
