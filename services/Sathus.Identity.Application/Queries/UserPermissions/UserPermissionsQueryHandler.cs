using MediatR;
using Sathus.Identity.Application.Interfaces;

namespace Sathus.Identity.Application.Queries.UserPermissions;

public sealed class UserPermissionsQueryHandler : IRequestHandler<UserPermissionsQuery, IReadOnlyList<string>>
{
    private readonly IPermissionService _permissions;

    public UserPermissionsQueryHandler(IPermissionService permissions)
    {
        _permissions = permissions;
    }

    public async Task<IReadOnlyList<string>> Handle(UserPermissionsQuery request, CancellationToken cancellationToken)
    {
        return await _permissions.GetPermissionsAsync(request.UserId, cancellationToken);
    }
}
