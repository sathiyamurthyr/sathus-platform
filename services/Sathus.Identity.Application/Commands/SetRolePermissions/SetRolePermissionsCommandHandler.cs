using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Application.Commands.SetRolePermissions;

namespace Sathus.Identity.Application.Commands.SetRolePermissions;

public sealed class SetRolePermissionsCommandHandler : IRequestHandler<SetRolePermissionsCommand, Unit>
{
    private readonly IRoleRepository _roles;
    private readonly IPermissionRepository _permissions;
    private readonly IAuditService _audit;

    public SetRolePermissionsCommandHandler(
        IRoleRepository roles,
        IPermissionRepository permissions,
        IAuditService audit)
    {
        _roles = roles;
        _permissions = permissions;
        _audit = audit;
    }

    public async Task<Unit> Handle(SetRolePermissionsCommand request, CancellationToken cancellationToken)
    {
        var role = await _roles.GetByIdAsync(request.RoleId, cancellationToken);
        if (role is null)
        {
            throw new RoleNotFoundException($"Role '{request.RoleId}' was not found.");
        }

        foreach (var permissionId in request.PermissionIds)
        {
            if (permissionId == Guid.Empty) continue;
            if (await _permissions.GetByIdAsync(permissionId, cancellationToken) is null)
            {
                throw new PermissionNotFoundException($"Permission '{permissionId}' was not found.");
            }
        }

        await _roles.SetPermissionsAsync(role.Id, request.PermissionIds, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("SetRolePermissions", nameof(Role), role.Id, EntityId: role.Id.ToString()),
            cancellationToken);

        return Unit.Value;
    }
}
