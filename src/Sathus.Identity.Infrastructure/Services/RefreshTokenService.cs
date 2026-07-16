namespace Sathus.Identity.Infrastructure.Services;

using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Infrastructure.Persistence;

public class RefreshTokenService(IdentityDbContext dbContext) : IRefreshTokenService
{
    private const int TokenLength = 64;

    public async Task<RefreshToken> GenerateTokenAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var tokenBytes = new byte[TokenLength];
        RandomNumberGenerator.Fill(tokenBytes);
        var token = Convert.ToBase64String(tokenBytes)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');

        var expiresAt = DateTime.UtcNow.AddDays(30);

        var refreshToken = new RefreshToken(token, userId, expiresAt);
        await dbContext.RefreshTokens.AddAsync(refreshToken, cancellationToken);

        return refreshToken;
    }

    public async Task<RefreshToken?> ValidateTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        var refreshToken = await dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token, cancellationToken);

        if (refreshToken is null)
        {
            return null;
        }

        if (refreshToken.RevokedAt is not null)
        {
            return null;
        }

        if (refreshToken.IsExpired)
        {
            return null;
        }

        return refreshToken;
    }

    public async Task RevokeTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        var refreshToken = await dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token, cancellationToken);

        if (refreshToken is not null && refreshToken.RevokedAt is null)
        {
            refreshToken.Revoke();
        }
    }

    public async Task<RefreshToken> RotateTokenAsync(string oldToken, CancellationToken cancellationToken = default)
    {
        var oldRefreshToken = await dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == oldToken, cancellationToken)
            ?? throw new InvalidOperationException("Refresh token not found.");

        if (oldRefreshToken.RevokedAt is not null)
        {
            throw new InvalidOperationException("Refresh token is already revoked.");
        }

        if (oldRefreshToken.IsExpired)
        {
            throw new InvalidOperationException("Refresh token is expired.");
        }

        oldRefreshToken.Revoke();

        var tokenBytes = new byte[TokenLength];
        RandomNumberGenerator.Fill(tokenBytes);
        var newTokenValue = Convert.ToBase64String(tokenBytes)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');

        var newRefreshToken = new RefreshToken(newTokenValue, oldRefreshToken.UserId, DateTime.UtcNow.AddDays(30));
        await dbContext.RefreshTokens.AddAsync(newRefreshToken, cancellationToken);

        return newRefreshToken;
    }
}
