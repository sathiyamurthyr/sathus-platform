using Microsoft.Extensions.Logging;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain;
using Sathus.Processing.Domain.ValueObjects;

namespace Sathus.Processing.Infrastructure.Processors;

/// <summary>
/// Fallback processor for asset categories without a dedicated processor. Records
/// basic metadata and flags the asset as unsupported so future modules can extend
/// coverage without modifying the pipeline.
/// </summary>
public sealed class UnknownProcessor : IAssetProcessor
{
    private readonly ILogger<UnknownProcessor> _logger;

    public UnknownProcessor(ILogger<UnknownProcessor> logger)
    {
        _logger = logger;
    }

    public string Name => "UnknownProcessor";

    public bool CanProcess(MediaType mediaType) => false;

    public Task<ProcessorOutput> ProcessAsync(ProcessingContext context, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("No dedicated processor for media type '{MediaType}' on asset {AssetId}.", context.MediaType.Value, context.AssetId);

        var metadata = new Dictionary<string, string>
        {
            ["format"] = context.MediaType.Value,
            ["mimeType"] = context.MimeType,
            ["fileSizeBytes"] = context.FileSize.ToString(),
            ["supported"] = "false"
        };

        return Task.FromResult(ProcessorOutput.Create(metadata, new List<Rendition>()));
    }
}
