using Microsoft.EntityFrameworkCore;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Infrastructure.Persistence;

namespace Sathus.Media.Infrastructure.Services;

/// <summary>
/// Persists media audit entries into the media_audit_logs table.
/// </summary>
public sealed class EfMediaAuditService : IMediaAuditService
{
    private readonly MediaDbContext _dbContext;

    public EfMediaAuditService(MediaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task LogAsync(MediaAuditEntry entry, CancellationToken cancellationToken = default)
    {
        var audit = new MediaAudit(
            entry.Action,
            entry.AssetId,
            entry.ActorId,
            entry.Details,
            entry.IpAddress,
            entry.CorrelationId);

        await _dbContext.MediaAudits.AddAsync(audit, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
