using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Results;

namespace Sathus.Storage.Infrastructure.Observability;

public class StorageHealthCheck : IHealthCheck
{
    private readonly IStorageProviderFactory _factory;
    private readonly ILogger<StorageHealthCheck> _logger;

    public StorageHealthCheck(IStorageProviderFactory factory, ILogger<StorageHealthCheck> logger)
    {
        _factory = factory;
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            var providers = _factory.GetAllProviders();
            var healthyCount = 0;
            var data = new System.Collections.Generic.Dictionary<string, object>();

            foreach (var provider in providers)
            {
                try
                {
                    await provider.GetMetadataAsync(string.Empty, cancellationToken);
                    data[provider.ProviderName] = "Healthy";
                    healthyCount++;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Health check failed for provider {Provider}", provider.ProviderName);
                    data[provider.ProviderName] = $"Unhealthy: {ex.Message}";
                }
            }

            if (healthyCount == 0)
                return HealthCheckResult.Unhealthy("All storage providers are unhealthy.", data: data);

            if (healthyCount < providers.Count)
                return HealthCheckResult.Degraded("Some storage providers are unhealthy.", data: data);

            return HealthCheckResult.Healthy("All storage providers are healthy.", data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Storage health check encountered an unexpected error.");
            return HealthCheckResult.Unhealthy("Storage health check failed.", ex);
        }
    }
}
