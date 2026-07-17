using MediatR;
using Sathus.Identity.Application.Interfaces;

namespace Sathus.Identity.Application.Commands.RevokeToken;

public sealed class RevokeTokenCommandHandler : IRequestHandler<RevokeTokenCommand, bool>
{
    private readonly IRefreshTokenService _refreshTokens;
    private readonly IAuditService _audit;

    public RevokeTokenCommandHandler(IRefreshTokenService refreshTokens, IAuditService audit)
    {
        _refreshTokens = refreshTokens;
        _audit = audit;
    }

    public async Task<bool> Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
    {
        var refreshToken = await _refreshTokens.ValidateTokenAsync(request.Token, cancellationToken);

        if (refreshToken is null)
        {
            return false;
        }

        await _refreshTokens.RevokeTokenAsync(request.Token, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("RevokeToken", "RefreshToken", refreshToken.UserId, EntityId: refreshToken.UserId.ToString()),
            cancellationToken);

        return true;
    }
}
