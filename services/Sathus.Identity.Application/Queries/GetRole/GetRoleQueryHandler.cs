using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Application.Queries.GetRole;

namespace Sathus.Identity.Application.Queries.GetRole;

public sealed class GetRoleQueryHandler : IRequestHandler<GetRoleQuery, RoleDetailResponse>
{
    private readonly IRoleRepository _roles;

    public GetRoleQueryHandler(IRoleRepository roles)
    {
        _roles = roles;
    }

    public async Task<RoleDetailResponse> Handle(GetRoleQuery request, CancellationToken cancellationToken)
    {
        var role = await _roles.GetByIdAsync(request.RoleId, cancellationToken);
        if (role is null)
        {
            throw new RoleNotFoundException($"Role '{request.RoleId}' was not found.");
        }

        var permissions = await _roles.GetPermissionNamesAsync(role.Id, cancellationToken);

        return new RoleDetailResponse(role.Id, role.Name, role.Description, permissions);
    }
}
