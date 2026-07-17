using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Application.Queries.GetRoles;

namespace Sathus.Identity.Application.Queries.GetRoles;

public sealed class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, IReadOnlyList<RoleDetailResponse>>
{
    private readonly IRoleRepository _roles;

    public GetRolesQueryHandler(IRoleRepository roles)
    {
        _roles = roles;
    }

    public async Task<IReadOnlyList<RoleDetailResponse>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        var roles = await _roles.GetAllAsync(cancellationToken);

        var result = new List<RoleDetailResponse>(roles.Count);
        foreach (var role in roles)
        {
            var permissions = await _roles.GetPermissionNamesAsync(role.Id, cancellationToken);
            result.Add(new RoleDetailResponse(role.Id, role.Name, role.Description, permissions));
        }

        return result;
    }
}
