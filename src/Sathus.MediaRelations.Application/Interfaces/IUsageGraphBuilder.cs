using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Application.Interfaces;

/// <summary>
/// Builds a recursive <see cref="MediaRelationshipGraph"/> rooted at an asset by walking
/// the reference and relation edges. Results are cached to keep read paths fast.
/// </summary>
public interface IUsageGraphBuilder
{
    Task<MediaRelationshipGraph> BuildAsync(Guid assetId, int maxDepth = 16, CancellationToken cancellationToken = default);
}
