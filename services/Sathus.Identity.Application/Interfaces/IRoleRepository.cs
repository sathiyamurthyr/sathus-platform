using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken = default);

    Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Role>> GetAllAsync(CancellationToken cancellationToken = default);

    Task AddAsync(Role role, CancellationToken cancellationToken = default);

    Task UpdateAsync(Role role, CancellationToken cancellationToken = default);

    Task DeleteAsync(Role role, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<string>> GetPermissionNamesAsync(Guid roleId, CancellationToken cancellationToken = default);

    Task SetPermissionsAsync(Guid roleId, IReadOnlyList<Guid> permissionIds, CancellationToken cancellationToken = default);

    Task<bool> HasUsersAsync(Guid roleId, CancellationToken cancellationToken = default);
}
