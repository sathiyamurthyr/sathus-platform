using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Sathus.Navigation.Api.HealthChecks;

public sealed class NavigationDbContextHealthCheck(NavigationDbContext dbContext) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            await dbContext.Database.CanConnectAsync(cancellationToken);
            return HealthCheckResult.Healthy("Navigation database is reachable.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Navigation database is unreachable.", ex);
        }
    }
}
