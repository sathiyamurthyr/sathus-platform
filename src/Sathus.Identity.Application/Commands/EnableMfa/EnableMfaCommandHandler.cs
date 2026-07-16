using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Commands.EnableMfa;

public sealed class EnableMfaCommandHandler : IRequestHandler<EnableMfaCommand, MfaSetupResponse>
{
    private const string Issuer = "Sathus";

    private readonly IUserRepository _users;
    private readonly ITotpService _totp;
    private readonly IAuditService _audit;

    public EnableMfaCommandHandler(IUserRepository users, ITotpService totp, IAuditService audit)
    {
        _users = users;
        _totp = totp;
        _audit = audit;
    }

    public async Task<MfaSetupResponse> Handle(EnableMfaCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);

        if (user is null)
        {
            throw new UserNotFoundException($"User '{request.UserId}' was not found.");
        }

        var secret = _totp.GenerateSecret();
        var qrCodeUri = _totp.GetQrCodeUri(secret, user.Email, Issuer);

        user.EnableMFA(secret);
        await _users.UpdateAsync(user, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("EnableMfa", nameof(User), user.Id, EntityId: user.Id.ToString()),
            cancellationToken);

        return new MfaSetupResponse(secret, qrCodeUri);
    }
}
