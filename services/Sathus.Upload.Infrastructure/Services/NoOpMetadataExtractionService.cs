using Microsoft.Extensions.Logging;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;

namespace Sathus.Upload.Infrastructure.Services;

public class NoOpMetadataExtractionService : IMetadataExtractionService
{
    private readonly ILogger<NoOpMetadataExtractionService> _logger;

    public NoOpMetadataExtractionService(ILogger<NoOpMetadataExtractionService> logger)
    {
        _logger = logger;
    }

    public Task<Dictionary<string, string>> ExtractAsync(UploadSession session, Stream stream, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Metadata extraction skipped for session {SessionId} (no-op).", session.Id);
        return Task.FromResult(new Dictionary<string, string>());
    }
}
