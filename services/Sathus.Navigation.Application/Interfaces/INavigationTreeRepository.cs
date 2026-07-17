using Sathus.Navigation.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Navigation.Application.Interfaces;

/// <summary>
/// Repository for navigation trees, the primary aggregate root of the navigation engine.
/// </summary>
public interface INavigationTreeRepository : IRepository<NavigationTree>
{
    Task<NavigationTree?> GetWithMenusAsync(Guid treeId, CancellationToken cancellationToken = default);

    Task<NavigationMenu?> GetMenuAsync(Guid menuId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<NavigationMenu>> GetMenusAsync(Guid treeId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<NavigationTree>> ListByPlatformAsync(Platform? platform, CancellationToken cancellationToken = default);

    Task<bool> RouteExistsAsync(Guid menuId, string routePath, Guid? exceptNodeId = null, CancellationToken cancellationToken = default);
}
