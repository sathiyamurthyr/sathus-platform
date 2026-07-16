using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Application.Commands.DeleteRole;

namespace Sathus.Identity.Application.Commands.DeleteRole;

public sealed class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, Unit>
{
    private readonly IRoleRepository _roles;
    private readonly IAuditService _audit;

    public DeleteRoleCommandHandler(IRoleRepository roles, IAuditService audit)
    {
        _roles = roles;
        _audit = audit;
    }

    public async Task<Unit> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _roles.GetByIdAsync(request.RoleId, cancellationToken);
        if (role is null)
        {
            throw new RoleNotFoundException($"Role '{request.RoleId}' was not found.");
        }

        if (await _roles.HasUsersAsync(request.RoleId, cancellationToken))
        {
            throw new RoleInUseException($"Role '{role.Name}' cannot be deleted because it is assigned to users.");
        }

        await _roles.DeleteAsync(role, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("DeleteRole", nameof(Role), role.Id, EntityId: role.Id.ToString()),
            cancellationToken);

        return Unit.Value;
    }
}
