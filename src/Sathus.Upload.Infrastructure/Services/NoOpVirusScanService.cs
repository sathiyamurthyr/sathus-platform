using Microsoft.Extensions.Logging;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;

namespace Sathus.Upload.Infrastructure.Services;

public class NoOpVirusScanService : IVirusScanService
{
    private readonly ILogger<NoOpVirusScanService> _logger;

    public NoOpVirusScanService(ILogger<NoOpVirusScanService> logger)
    {
        _logger = logger;
    }

    public Task<bool> ScanAsync(UploadSession session, Stream stream, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Virus scan skipped for session {SessionId} (no-op).", session.Id);
        return Task.FromResult(true);
    }
}
