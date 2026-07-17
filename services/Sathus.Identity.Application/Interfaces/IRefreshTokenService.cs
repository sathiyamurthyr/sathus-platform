using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Interfaces;

public interface IRefreshTokenService
{
    Task<RefreshToken> GenerateTokenAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<RefreshToken?> ValidateTokenAsync(string token, CancellationToken cancellationToken = default);

    Task RevokeTokenAsync(string token, CancellationToken cancellationToken = default);

    Task<RefreshToken> RotateTokenAsync(string oldToken, CancellationToken cancellationToken = default);
}
