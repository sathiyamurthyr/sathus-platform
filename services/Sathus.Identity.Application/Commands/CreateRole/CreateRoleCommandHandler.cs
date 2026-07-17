using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Application.Commands.CreateRole;

namespace Sathus.Identity.Application.Commands.CreateRole;

public sealed class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, RoleResponse>
{
    private readonly IRoleRepository _roles;
    private readonly IAuditService _audit;

    public CreateRoleCommandHandler(IRoleRepository roles, IAuditService audit)
    {
        _roles = roles;
        _audit = audit;
    }

    public async Task<RoleResponse> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        if (await _roles.ExistsByNameAsync(request.Name, cancellationToken))
        {
            throw new RoleAlreadyExistsException($"A role named '{request.Name}' already exists.");
        }

        var role = new Role(request.Name);
        role.SetDescription(request.Description, DateTime.UtcNow);

        await _roles.AddAsync(role, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("CreateRole", nameof(Role), role.Id, EntityId: role.Id.ToString()),
            cancellationToken);

        return new RoleResponse(role.Id, role.Name, role.Description);
    }
}
