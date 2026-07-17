using Sathus.Navigation.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Navigation.Application.Interfaces;

/// <summary>
/// Repository for navigation menus, including their node trees, versions and published items.
/// </summary>
public interface INavigationMenuRepository : IRepository<NavigationMenu>
{
    Task<NavigationMenu?> GetWithNodesAsync(Guid menuId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<NavigationItem>> GetItemsAsync(Guid menuId, Guid versionId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<NavigationVersion>> GetVersionsAsync(Guid menuId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<NavigationRedirect>> GetRedirectsAsync(Guid menuId, CancellationToken cancellationToken = default);
}
