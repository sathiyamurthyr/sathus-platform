using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Interfaces;

public interface ISessionService
{
    Task<UserSession> CreateSessionAsync(
        Guid userId,
        string? ipAddress,
        string? userAgent,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<UserSession>> GetActiveSessionsAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task RevokeSessionAsync(Guid sessionId, CancellationToken cancellationToken = default);

    Task RevokeAllSessionsAsync(Guid userId, CancellationToken cancellationToken = default);
}
