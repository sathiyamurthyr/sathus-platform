using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Application.Queries.GetPermissions;

namespace Sathus.Identity.Application.Queries.GetPermissions;

public sealed class GetPermissionsQueryHandler : IRequestHandler<GetPermissionsQuery, IReadOnlyList<PermissionResponse>>
{
    private readonly IPermissionRepository _permissions;

    public GetPermissionsQueryHandler(IPermissionRepository permissions)
    {
        _permissions = permissions;
    }

    public async Task<IReadOnlyList<PermissionResponse>> Handle(GetPermissionsQuery request, CancellationToken cancellationToken)
    {
        var permissions = await _permissions.GetAllAsync(cancellationToken);

        var result = new List<PermissionResponse>(permissions.Count);
        foreach (var permission in permissions)
        {
            result.Add(new PermissionResponse(permission.Id, permission.Name, permission.Description));
        }

        return result;
    }
}
