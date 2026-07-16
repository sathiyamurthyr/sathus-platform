using System.IO.Compression;
using System.Text;
using Microsoft.Extensions.Logging;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain;
using Sathus.Processing.Domain.ValueObjects;

namespace Sathus.Processing.Infrastructure.Processors;

/// <summary>
/// Processes archive assets (ZIP). Extracts entry count, total uncompressed size and
/// top-level entries for inventory metadata.
/// </summary>
public sealed class ArchiveProcessor : IAssetProcessor
{
    private readonly ILogger<ArchiveProcessor> _logger;

    public ArchiveProcessor(ILogger<ArchiveProcessor> logger)
    {
        _logger = logger;
    }

    public string Name => "ArchiveProcessor";

    public bool CanProcess(MediaType mediaType) => mediaType.Value == MediaType.Archive.Value;

    public async Task<ProcessorOutput> ProcessAsync(ProcessingContext context, CancellationToken cancellationToken = default)
    {
        var metadata = new Dictionary<string, string>();
        var bytes = await ProcessorSupport.ReadAllBytesAsync(context.Source, cancellationToken);

        if (!ProcessorSupport.StartsWith(bytes, "PK"u8.ToArray()))
        {
            throw new UnsupportedAssetException($"Unsupported archive format for asset '{context.FileName}'.");
        }

        try
        {
            using var archive = new ZipArchive(new MemoryStream(bytes), ZipArchiveMode.Read, leaveOpen: false);
            long totalUncompressed = 0;
            var topLevel = new HashSet<string>(StringComparer.Ordinal);

            foreach (var entry in archive.Entries)
            {
                totalUncompressed += entry.Length;
                var slash = entry.FullName.IndexOf('/');
                topLevel.Add(slash > 0 ? entry.FullName[..slash] : entry.FullName);
            }

            metadata["format"] = "zip";
            metadata["entryCount"] = archive.Entries.Count.ToString();
            metadata["totalUncompressedBytes"] = totalUncompressed.ToString();
            metadata["topLevelEntries"] = string.Join(",", topLevel.Take(20));
        }
        catch (Exception ex)
        {
            throw new AssetProcessingException($"Failed to read archive '{context.FileName}': {ex.Message}", ex);
        }

        return ProcessorOutput.Create(metadata, new List<Rendition>());
    }
}
