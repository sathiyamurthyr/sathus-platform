using Microsoft.Extensions.Diagnostics.HealthChecks;
using Sathus.Media.Infrastructure.Persistence;

namespace Sathus.Media.Api.HealthChecks;

public sealed class MediaDbContextHealthCheck : IHealthCheck
{
    private readonly MediaDbContext _dbContext;

    public MediaDbContextHealthCheck(MediaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var canConnect = await _dbContext.Database.CanConnectAsync(cancellationToken);
            return canConnect
                ? HealthCheckResult.Healthy("Media database is reachable.")
                : HealthCheckResult.Unhealthy("Media database is unreachable.");
        }
        catch (Exception exception)
        {
            return HealthCheckResult.Unhealthy("Media database is unreachable.", exception);
        }
    }
}
