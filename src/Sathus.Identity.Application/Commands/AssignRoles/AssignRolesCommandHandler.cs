using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Application.Commands.AssignRoles;

namespace Sathus.Identity.Application.Commands.AssignRoles;

public sealed class AssignRolesCommandHandler : IRequestHandler<AssignRolesCommand, Unit>
{
    private readonly IUserRepository _users;
    private readonly IAuditService _audit;

    public AssignRolesCommandHandler(IUserRepository users, IAuditService audit)
    {
        _users = users;
        _audit = audit;
    }

    public async Task<Unit> Handle(AssignRolesCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw new UserNotFoundException($"User '{request.UserId}' was not found.");
        }

        user.ReplaceRoles(request.RoleIds, DateTime.UtcNow);
        await _users.UpdateAsync(user, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("AssignRoles", nameof(User), user.Id, EntityId: user.Id.ToString()),
            cancellationToken);

        return Unit.Value;
    }
}
