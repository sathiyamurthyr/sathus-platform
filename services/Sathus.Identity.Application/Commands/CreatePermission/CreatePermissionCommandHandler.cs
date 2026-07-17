using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Application.Commands.CreatePermission;

namespace Sathus.Identity.Application.Commands.CreatePermission;

public sealed class CreatePermissionCommandHandler : IRequestHandler<CreatePermissionCommand, PermissionResponse>
{
    private readonly IPermissionRepository _permissions;
    private readonly IAuditService _audit;

    public CreatePermissionCommandHandler(IPermissionRepository permissions, IAuditService audit)
    {
        _permissions = permissions;
        _audit = audit;
    }

    public async Task<PermissionResponse> Handle(CreatePermissionCommand request, CancellationToken cancellationToken)
    {
        if (await _permissions.ExistsByNameAsync(request.Name, cancellationToken))
        {
            throw new PermissionAlreadyExistsException($"A permission named '{request.Name}' already exists.");
        }

        var permission = new Permission(request.Name);
        permission.SetDescription(request.Description, DateTime.UtcNow);

        await _permissions.AddAsync(permission, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("CreatePermission", nameof(Permission), permission.Id, EntityId: permission.Id.ToString()),
            cancellationToken);

        return new PermissionResponse(permission.Id, permission.Name, permission.Description);
    }
}
