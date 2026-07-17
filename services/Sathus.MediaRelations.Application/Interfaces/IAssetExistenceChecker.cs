namespace Sathus.MediaRelations.Application.Interfaces;

/// <summary>
/// Abstraction over the DAM Foundation used to check whether an asset still exists.
/// Implemented by infrastructure so the engine remains decoupled from the Media module.
/// </summary>
public interface IAssetExistenceChecker
{
    Task<bool> ExistsAsync(Guid assetId, CancellationToken cancellationToken = default);

    /// <summary>Bulk existence lookup returning the set of asset ids that exist.</summary>
    Task<IReadOnlySet<Guid>> ExistingAsync(IReadOnlyCollection<Guid> assetIds, CancellationToken cancellationToken = default);
}
