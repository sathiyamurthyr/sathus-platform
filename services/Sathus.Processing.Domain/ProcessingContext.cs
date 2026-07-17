using System.IO;
using Sathus.Media.Domain.ValueObjects;

namespace Sathus.Processing.Domain;

/// <summary>
/// Immutable context describing the asset being processed. The <see cref="Source"/>
/// stream is opened by the pipeline and disposed after processing completes.
/// </summary>
public sealed class ProcessingContext
{
    public Guid AssetId { get; init; }
    public string StorageKey { get; init; } = string.Empty;
    public string FileName { get; init; } = string.Empty;
    public string MimeType { get; init; } = string.Empty;
    public MediaType MediaType { get; init; } = null!;
    public long FileSize { get; init; }
    public Stream Source { get; init; } = null!;
    public IReadOnlyDictionary<string, string> ExistingMetadata { get; init; } = new Dictionary<string, string>();
    public ProcessingOptions Options { get; init; } = ProcessingOptions.Default;
}
