namespace Sathus.Identity.Application.Interfaces;

public interface IPermissionService
{
    Task<IReadOnlyList<string>> GetPermissionsAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<bool> HasPermissionAsync(Guid userId, string permission, CancellationToken cancellationToken = default);
}
