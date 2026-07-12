using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Application.Commands.DeactivateUser;

namespace Sathus.Identity.Application.Commands.DeactivateUser;

public sealed class DeactivateUserCommandHandler : IRequestHandler<DeactivateUserCommand, Unit>
{
    private readonly IUserRepository _users;
    private readonly IAuditService _audit;

    public DeactivateUserCommandHandler(IUserRepository users, IAuditService audit)
    {
        _users = users;
        _audit = audit;
    }

    public async Task<Unit> Handle(DeactivateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw new UserNotFoundException($"User '{request.UserId}' was not found.");
        }

        user.Suspend(DateTime.UtcNow);
        await _users.UpdateAsync(user, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("DeactivateUser", nameof(User), user.Id, EntityId: user.Id.ToString()),
            cancellationToken);

        return Unit.Value;
    }
}
