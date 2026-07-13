using Microsoft.Extensions.Diagnostics.HealthChecks;
using Sathus.Processing.Application.Interfaces;

namespace Sathus.Processing.Api.HealthChecks;

public class ProcessingQueueHealthCheck : IHealthCheck
{
    private readonly IProcessingJobQueue _queue;

    public ProcessingQueueHealthCheck(IProcessingJobQueue queue)
    {
        _queue = queue;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            var healthy = await _queue.IsHealthyAsync(cancellationToken);
            return healthy
                ? HealthCheckResult.Healthy("Processing job queue is healthy.")
                : HealthCheckResult.Unhealthy("Processing job queue is not healthy.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Processing job queue health check failed.", ex);
        }
    }
}
