using MediatR;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Commands.Logout;

public sealed class LogoutCommandHandler : IRequestHandler<LogoutCommand, bool>
{
    private readonly IRefreshTokenService _refreshTokens;
    private readonly ISessionService _sessions;
    private readonly IAuditService _audit;

    public LogoutCommandHandler(
        IRefreshTokenService refreshTokens,
        ISessionService sessions,
        IAuditService audit)
    {
        _refreshTokens = refreshTokens;
        _sessions = sessions;
        _audit = audit;
    }

    public async Task<bool> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var refreshToken = await _refreshTokens.ValidateTokenAsync(request.RefreshToken, cancellationToken);

        if (refreshToken is null)
        {
            return false;
        }

        await _refreshTokens.RevokeTokenAsync(request.RefreshToken, cancellationToken);
        await _sessions.RevokeAllSessionsAsync(refreshToken.UserId, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("Logout", nameof(User), refreshToken.UserId, EntityId: refreshToken.UserId.ToString()),
            cancellationToken);

        return true;
    }
}
