namespace Sathus.Content.Infrastructure.Services;

using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Infrastructure.Persistence;

public class AuditService(ContentDbContext dbContext) : IAuditService
{
    public async Task LogAsync(AuditEntry entry, CancellationToken cancellationToken = default)
    {
        var auditLog = new AuditLog(
            action: entry.Action,
            entityType: entry.EntityName,
            entityId: entry.EntityId ?? string.Empty,
            changes: entry.Changes,
            ipAddress: entry.IpAddress,
            actorId: entry.UserId);

        await dbContext.AuditLogs.AddAsync(auditLog, cancellationToken);
    }
}
