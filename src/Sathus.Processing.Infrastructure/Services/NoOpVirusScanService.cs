using Microsoft.Extensions.Logging;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain;

namespace Sathus.Processing.Infrastructure.Services;

/// <summary>
/// Safe default virus-scan hook. Until a real scanner (e.g. ClamAV) is wired in,
/// assets are passed through. Replace via DI with a production scanner.
/// </summary>
public sealed class NoOpVirusScanService : Sathus.Processing.Application.Interfaces.IVirusScanService
{
    private readonly ILogger<NoOpVirusScanService> _logger;

    public NoOpVirusScanService(ILogger<NoOpVirusScanService> logger)
    {
        _logger = logger;
    }

    public Task<bool> ScanAsync(Stream stream, string storageKey, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Virus scan skipped for {StorageKey} (no-op).", storageKey);
        return Task.FromResult(true);
    }
}
