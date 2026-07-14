namespace Sathus.Search.Application.Interfaces;

public interface ISearchPermissionProvider
{
    Task<IReadOnlyList<SearchFilter>> GetFiltersForUserAsync(string userId, string userRoles, CancellationToken cancellationToken);
}
