namespace Sathus.Identity.Infrastructure.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Infrastructure.Persistence;

public class SessionService(IdentityDbContext dbContext) : ISessionService
{
    private const int DefaultSessionExpiryMinutes = 60;

    public async Task<UserSession> CreateSessionAsync(Guid userId, string? ipAddress, string? userAgent, CancellationToken cancellationToken = default)
    {
        var expiresAt = DateTime.UtcNow.AddMinutes(DefaultSessionExpiryMinutes);
        var session = new UserSession(userId, ipAddress, userAgent, expiresAt);
        await dbContext.UserSessions.AddAsync(session, cancellationToken);
        return session;
    }

    public async Task<IReadOnlyList<UserSession>> GetActiveSessionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await dbContext.UserSessions
            .AsNoTracking()
            .Where(us => us.UserId == userId && us.RevokedAt == null && us.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(us => us.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task RevokeSessionAsync(Guid sessionId, CancellationToken cancellationToken = default)
    {
        var session = await dbContext.UserSessions.FirstOrDefaultAsync(us => us.Id == sessionId, cancellationToken);
        if (session is not null && session.RevokedAt is null)
        {
            session.Revoke(DateTime.UtcNow);
        }
    }

    public async Task RevokeAllSessionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var activeSessions = await dbContext.UserSessions
            .Where(us => us.UserId == userId && us.RevokedAt == null)
            .ToListAsync(cancellationToken);

        foreach (var session in activeSessions)
        {
            session.Revoke(DateTime.UtcNow);
        }
    }

    public async Task UpdateLastActivityAsync(Guid sessionId, CancellationToken cancellationToken = default)
    {
        var session = await dbContext.UserSessions.FirstOrDefaultAsync(us => us.Id == sessionId, cancellationToken);
        if (session is not null)
        {
            session.RecordActivity(DateTime.UtcNow);
        }
    }
}
