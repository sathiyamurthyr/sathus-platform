namespace Sathus.Navigation.Application.Interfaces;

/// <summary>
/// Integration port to the Permission Engine for verifying a permission identifier exists.
/// Implemented by an HTTP adapter; returns true when the catalog is unreachable so authoring
/// is never blocked by the permission service being offline.
/// </summary>
public interface IPermissionCatalog
{
    Task<bool> ExistsAsync(string permission, CancellationToken cancellationToken = default);
}
