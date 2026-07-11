using MediatR;
using Sathus.Identity.Application.Interfaces;

namespace Sathus.Identity.Application.Commands.ForgotPassword;

public sealed class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, bool>
{
    private readonly IUserRepository _users;
    private readonly IEmailService _email;
    private readonly IJwtService _jwt;
    private readonly IAuditService _audit;

    public ForgotPasswordCommandHandler(
        IUserRepository users,
        IEmailService email,
        IJwtService jwt,
        IAuditService audit)
    {
        _users = users;
        _email = email;
        _jwt = jwt;
        _audit = audit;
    }

    public async Task<bool> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByEmailAsync(request.Email, cancellationToken);

        if (user is not null && user.Status != Sathus.Identity.Domain.Enums.UserStatus.Deleted)
        {
            var resetToken = _jwt.GeneratePasswordResetToken(user.Id, user.Email);
            await _email.SendPasswordResetEmailAsync(user.Email, resetToken, cancellationToken);

            await _audit.LogAsync(
                new AuditEntry("ForgotPassword", nameof(Sathus.Identity.Domain.Entities.User), user.Id,
                    EntityId: user.Id.ToString()),
                cancellationToken);
        }

        return true;
    }
}
