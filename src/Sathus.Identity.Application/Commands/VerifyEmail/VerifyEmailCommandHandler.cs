using MediatR;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Application.Commands.VerifyEmail;

public sealed class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, bool>
{
    private readonly IUserRepository _users;
    private readonly IJwtService _jwt;
    private readonly IAuditService _audit;

    public VerifyEmailCommandHandler(IUserRepository users, IJwtService jwt, IAuditService audit)
    {
        _users = users;
        _jwt = jwt;
        _audit = audit;
    }

    public async Task<bool> Handle(VerifyEmailCommand request, CancellationToken cancellationToken)
    {
        if (!_jwt.TryValidateEmailVerificationToken(request.Token, out var userId))
        {
            throw new InvalidTokenException("The email verification token is invalid or has expired.");
        }

        var user = await _users.GetByIdAsync(userId, cancellationToken);

        if (user is null)
        {
            throw new InvalidTokenException("The email verification token is no longer valid.");
        }

        if (!user.EmailConfirmed)
        {
            user.Reactivate(DateTime.UtcNow);
            await _users.UpdateAsync(user, cancellationToken);

            await _audit.LogAsync(
                new AuditEntry("VerifyEmail", nameof(User), user.Id, EntityId: user.Id.ToString()),
                cancellationToken);
        }

        return true;
    }
}
