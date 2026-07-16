using MediatR;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Commands.ResetPassword;

public sealed class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, bool>
{
    private const int PasswordHistoryLimit = 5;

    private readonly IUserRepository _users;
    private readonly IPasswordService _passwords;
    private readonly IPasswordHistoryRepository _passwordHistory;
    private readonly ISessionService _sessions;
    private readonly IJwtService _jwt;
    private readonly IAuditService _audit;

    public ResetPasswordCommandHandler(
        IUserRepository users,
        IPasswordService passwords,
        IPasswordHistoryRepository passwordHistory,
        ISessionService sessions,
        IJwtService jwt,
        IAuditService audit)
    {
        _users = users;
        _passwords = passwords;
        _passwordHistory = passwordHistory;
        _sessions = sessions;
        _jwt = jwt;
        _audit = audit;
    }

    public async Task<bool> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        if (!_jwt.TryValidatePasswordResetToken(request.Token, out var userId))
        {
            throw new InvalidTokenException("The password reset token is invalid or has expired.");
        }

        var user = await _users.GetByIdAsync(userId, cancellationToken);

        if (user is null)
        {
            throw new InvalidTokenException("The password reset token is no longer valid.");
        }

        if (_passwords.VerifyPassword(request.NewPassword, user.PasswordHash))
        {
            throw new AppException("The new password must be different from the current password.");
        }

        var history = await _passwordHistory.GetByUserAsync(user.Id, PasswordHistoryLimit, cancellationToken);
        foreach (var entry in history)
        {
            if (_passwords.VerifyPassword(request.NewPassword, entry.PasswordHash))
            {
                throw new AppException("You cannot reuse one of your recent passwords.");
            }
        }

        user.ChangePassword(_passwords.HashPassword(request.NewPassword), DateTime.UtcNow);
        await _users.UpdateAsync(user, cancellationToken);

        await _passwordHistory.AddAsync(new PasswordHistory(user.Id, user.PasswordHash), cancellationToken);

        await _sessions.RevokeAllSessionsAsync(user.Id, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("ResetPassword", nameof(User), user.Id, EntityId: user.Id.ToString()),
            cancellationToken);

        return true;
    }
}
