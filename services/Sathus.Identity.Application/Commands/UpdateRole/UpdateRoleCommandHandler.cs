using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Application.Commands.UpdateRole;

namespace Sathus.Identity.Application.Commands.UpdateRole;

public sealed class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, RoleResponse>
{
    private readonly IRoleRepository _roles;
    private readonly IAuditService _audit;

    public UpdateRoleCommandHandler(IRoleRepository roles, IAuditService audit)
    {
        _roles = roles;
        _audit = audit;
    }

    public async Task<RoleResponse> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _roles.GetByIdAsync(request.RoleId, cancellationToken);
        if (role is null)
        {
            throw new RoleNotFoundException($"Role '{request.RoleId}' was not found.");
        }

        if (!string.Equals(role.Name, request.Name, StringComparison.OrdinalIgnoreCase)
            && await _roles.ExistsByNameAsync(request.Name, cancellationToken))
        {
            throw new RoleAlreadyExistsException($"A role named '{request.Name}' already exists.");
        }

        var now = DateTime.UtcNow;
        role.Rename(request.Name, now);
        role.SetDescription(request.Description, now);

        await _roles.UpdateAsync(role, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("UpdateRole", nameof(Role), role.Id, EntityId: role.Id.ToString()),
            cancellationToken);

        return new RoleResponse(role.Id, role.Name, role.Description);
    }
}
