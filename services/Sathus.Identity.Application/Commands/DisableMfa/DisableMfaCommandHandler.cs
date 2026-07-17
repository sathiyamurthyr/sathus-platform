using MediatR;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Commands.DisableMfa;

public sealed class DisableMfaCommandHandler : IRequestHandler<DisableMfaCommand, bool>
{
    private readonly IUserRepository _users;
    private readonly IAuditService _audit;

    public DisableMfaCommandHandler(IUserRepository users, IAuditService audit)
    {
        _users = users;
        _audit = audit;
    }

    public async Task<bool> Handle(DisableMfaCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);

        if (user is null)
        {
            throw new UserNotFoundException($"User '{request.UserId}' was not found.");
        }

        user.DisableMFA();
        await _users.UpdateAsync(user, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("DisableMfa", nameof(User), user.Id, EntityId: user.Id.ToString()),
            cancellationToken);

        return true;
    }
}
