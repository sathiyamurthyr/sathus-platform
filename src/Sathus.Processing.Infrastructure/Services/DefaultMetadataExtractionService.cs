using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain;

namespace Sathus.Processing.Infrastructure.Services;

/// <summary>
/// Extracts common, format-agnostic metadata available before processor-specific
/// analysis (file name, size, MIME type, extension).
/// </summary>
public sealed class DefaultMetadataExtractionService : Sathus.Processing.Application.Interfaces.IMetadataExtractionService
{
    public Task<IReadOnlyDictionary<string, string>> ExtractAsync(ProcessingContext context, CancellationToken cancellationToken = default)
    {
        var extension = Path.GetExtension(context.FileName)?.TrimStart('.').ToLowerInvariant() ?? string.Empty;

        var metadata = new Dictionary<string, string>
        {
            ["fileName"] = context.FileName,
            ["mimeType"] = context.MimeType,
            ["fileSizeBytes"] = context.FileSize.ToString(),
            ["extension"] = extension,
            ["source"] = "storage"
        };

        return Task.FromResult<IReadOnlyDictionary<string, string>>(metadata);
    }
}
