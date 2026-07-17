using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Application.Commands.ResetUserPassword;

namespace Sathus.Identity.Application.Commands.ResetUserPassword;

public sealed class ResetUserPasswordCommandHandler : IRequestHandler<ResetUserPasswordCommand, Unit>
{
    private readonly IUserRepository _users;
    private readonly IPasswordService _passwords;
    private readonly IAuditService _audit;

    public ResetUserPasswordCommandHandler(IUserRepository users, IPasswordService passwords, IAuditService audit)
    {
        _users = users;
        _passwords = passwords;
        _audit = audit;
    }

    public async Task<Unit> Handle(ResetUserPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw new UserNotFoundException($"User '{request.UserId}' was not found.");
        }

        user.ChangePassword(_passwords.HashPassword(request.NewPassword), DateTime.UtcNow);
        await _users.UpdateAsync(user, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("ResetUserPassword", nameof(User), user.Id, EntityId: user.Id.ToString()),
            cancellationToken);

        return Unit.Value;
    }
}
