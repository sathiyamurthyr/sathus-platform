namespace Sathus.Identity.Infrastructure.Services;

using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Infrastructure.Persistence;

public class AuditService(IdentityDbContext dbContext) : IAuditService
{
    public async Task LogAsync(AuditEntry entry, CancellationToken cancellationToken = default)
    {
        var actorId = entry.UserId;
        var actorEmail = entry.UserId is null ? null : await dbContext.Users
            .Where(u => u.Id == entry.UserId)
            .Select(u => u.Email)
            .FirstOrDefaultAsync(cancellationToken);

        var auditLog = new AuditLog(
            actorEmail: actorEmail,
            action: entry.Action,
            entityType: entry.EntityName,
            entityId: entry.EntityId ?? string.Empty,
            changes: entry.Changes,
            ipAddress: entry.IpAddress,
            actorId: actorId);

        await dbContext.AuditLogs.AddAsync(auditLog, cancellationToken);
    }
}
