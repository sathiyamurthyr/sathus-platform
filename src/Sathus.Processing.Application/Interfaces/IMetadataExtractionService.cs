using Sathus.Processing.Domain;

namespace Sathus.Processing.Application.Interfaces;

/// <summary>
/// Extracts common, format-agnostic metadata from an asset (size, dates, etc.).
/// Format-specific metadata is produced by the registered asset processors.
/// </summary>
public interface IMetadataExtractionService
{
    Task<IReadOnlyDictionary<string, string>> ExtractAsync(ProcessingContext context, CancellationToken cancellationToken = default);
}
