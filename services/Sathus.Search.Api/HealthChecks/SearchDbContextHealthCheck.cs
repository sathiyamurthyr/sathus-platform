using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Sathus.Search.Infrastructure.Persistence;

namespace Sathus.Search.Api.HealthChecks;

public sealed class SearchDbContextHealthCheck(SearchDbContext dbContext) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            await dbContext.Database.CanConnectAsync(cancellationToken);
            return HealthCheckResult.Healthy("Search database is reachable.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Search database is unreachable.", ex);
        }
    }
}
