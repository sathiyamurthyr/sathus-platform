using Microsoft.Extensions.Diagnostics.HealthChecks;
using Sathus.Processing.Infrastructure.Persistence;

namespace Sathus.Processing.Api.HealthChecks;

public class ProcessingDbContextHealthCheck : IHealthCheck
{
    private readonly ProcessingDbContext _dbContext;

    public ProcessingDbContextHealthCheck(ProcessingDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            await _dbContext.Database.CanConnectAsync(cancellationToken);
            return HealthCheckResult.Healthy("Processing database connection is healthy.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Processing database connection failed.", ex);
        }
    }
}
