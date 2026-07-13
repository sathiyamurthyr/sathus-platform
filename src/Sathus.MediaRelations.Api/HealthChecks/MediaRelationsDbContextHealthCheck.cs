using Microsoft.Extensions.Diagnostics.HealthChecks;
using Sathus.MediaRelations.Infrastructure.Persistence;

namespace Sathus.MediaRelations.Api.HealthChecks;

public sealed class MediaRelationsDbContextHealthCheck : IHealthCheck
{
    private readonly MediaRelationsDbContext _dbContext;

    public MediaRelationsDbContextHealthCheck(MediaRelationsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            await _dbContext.Database.CanConnectAsync(cancellationToken);
            return HealthCheckResult.Healthy("Media relations database connection is healthy.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Media relations database connection failed.", ex);
        }
    }
}
