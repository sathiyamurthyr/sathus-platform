using Microsoft.Extensions.Diagnostics.HealthChecks;
using Sathus.Upload.Infrastructure.Persistence;

namespace Sathus.Upload.Api.HealthChecks;

public class UploadDbContextHealthCheck : IHealthCheck
{
    private readonly UploadDbContext _dbContext;

    public UploadDbContextHealthCheck(UploadDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            await _dbContext.Database.CanConnectAsync(cancellationToken);
            return HealthCheckResult.Healthy("Upload database connection is healthy.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Upload database connection failed.", ex);
        }
    }
}
