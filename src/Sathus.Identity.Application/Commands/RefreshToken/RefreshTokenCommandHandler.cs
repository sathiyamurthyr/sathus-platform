using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Commands.RefreshToken;

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, TokenResponse>
{
    private readonly IRefreshTokenService _refreshTokens;
    private readonly IJwtService _jwt;
    private readonly IUserRepository _users;
    private readonly IAuditService _audit;

    public RefreshTokenCommandHandler(
        IRefreshTokenService refreshTokens,
        IJwtService jwt,
        IUserRepository users,
        IAuditService audit)
    {
        _refreshTokens = refreshTokens;
        _jwt = jwt;
        _users = users;
        _audit = audit;
    }

    public async Task<TokenResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var oldToken = await _refreshTokens.ValidateTokenAsync(request.RefreshToken, cancellationToken);

        if (oldToken is null)
        {
            throw new InvalidTokenException("The refresh token is invalid or has been revoked.");
        }

        var newToken = await _refreshTokens.RotateTokenAsync(request.RefreshToken, cancellationToken);

        var user = await _users.GetByIdAsync(oldToken.UserId, cancellationToken);

        if (user is null)
        {
            throw new InvalidTokenException("The refresh token is no longer associated with a valid user.");
        }

        var roles = await _users.GetRoleNamesAsync(user.Id, cancellationToken);
        var permissions = await _users.GetPermissionNamesAsync(user.Id, cancellationToken);
        var accessToken = _jwt.GenerateAccessToken(user.Id, user.Email, roles, permissions);

        await _audit.LogAsync(
            new AuditEntry("RefreshToken", nameof(User), user.Id, EntityId: user.Id.ToString()),
            cancellationToken);

        return new TokenResponse(accessToken, newToken.Token);
    }
}
