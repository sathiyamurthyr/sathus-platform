using Microsoft.Extensions.Logging;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain.Entities;
using Sathus.Processing.Domain.Enums;
using Sathus.Processing.Domain.ValueObjects;

namespace Sathus.Processing.Infrastructure.Services;

/// <summary>
/// Orchestrates the full asset processing pipeline for a single job: validation,
/// virus scan, metadata extraction, checksum, duplicate detection and the registered
/// asset processor. Persists state transitions (and thereby dispatches domain events)
/// through the repository on each step.
/// </summary>
public sealed class AssetProcessingPipeline : IAssetProcessingPipeline
{
    private readonly IAssetSourceProvider _source;
    private readonly Sathus.Processing.Application.Interfaces.IVirusScanService _virusScan;
    private readonly Sathus.Processing.Application.Interfaces.IMetadataExtractionService _metadata;
    private readonly IChecksumService _checksum;
    private readonly IDuplicateDetector _duplicate;
    private readonly IProcessorRegistry _registry;
    private readonly IProcessingJobRepository _repository;
    private readonly ILogger<AssetProcessingPipeline> _logger;

    public AssetProcessingPipeline(
        IAssetSourceProvider source,
        Sathus.Processing.Application.Interfaces.IVirusScanService virusScan,
        Sathus.Processing.Application.Interfaces.IMetadataExtractionService metadata,
        IChecksumService checksum,
        IDuplicateDetector duplicate,
        IProcessorRegistry registry,
        IProcessingJobRepository repository,
        ILogger<AssetProcessingPipeline> logger)
    {
        _source = source;
        _virusScan = virusScan;
        _metadata = metadata;
        _checksum = checksum;
        _duplicate = duplicate;
        _registry = registry;
        _repository = repository;
        _logger = logger;
    }

    public async Task<PipelineResult> ExecuteAsync(AssetProcessingJob job, CancellationToken cancellationToken = default)
    {
        try
        {
            job.MarkRunning();
            await _repository.SaveChangesAsync(cancellationToken);

            await using var sourceStream = await _source.OpenAsync(job.StorageKey, cancellationToken);
            using var buffer = new MemoryStream();
            await sourceStream.CopyToAsync(buffer, cancellationToken);
            buffer.Position = 0;

            job.MarkStep(ProcessingStep.Validation);
            if (buffer.Length == 0)
            {
                job.MarkFailed("Asset stream is empty.");
                await _repository.SaveChangesAsync(cancellationToken);
                return new PipelineResult(false, "Asset stream is empty.");
            }

            job.MarkStep(ProcessingStep.VirusScan);
            buffer.Position = 0;
            var clean = await _virusScan.ScanAsync(buffer, job.StorageKey, cancellationToken);
            if (!clean)
            {
                job.MarkFailed("Virus scan detected a threat.");
                await _repository.SaveChangesAsync(cancellationToken);
                return new PipelineResult(false, "Virus scan detected a threat.");
            }

            job.MarkStep(ProcessingStep.MetadataExtraction);
            buffer.Position = 0;
            var commonMetadata = await _metadata.ExtractAsync(BuildContext(job, buffer), cancellationToken);
            job.RecordMetadata(commonMetadata);

            job.MarkStep(ProcessingStep.Checksum);
            buffer.Position = 0;
            var checksum = await _checksum.ComputeAsync(buffer, "sha256", cancellationToken);
            job.SetChecksum(checksum);

            job.MarkStep(ProcessingStep.DuplicateDetection);
            var duplicateOf = await _duplicate.DetectAsync(checksum, job.AssetId, cancellationToken);
            if (duplicateOf.HasValue)
            {
                job.MarkDuplicate(duplicateOf.Value);
                _logger.LogInformation("Duplicate asset detected for job {JobId}: {DuplicateOf}.", job.Id, duplicateOf.Value);
            }

            var mediaType = job.MediaType;
            var processor = _registry.Resolve(mediaType)
                ?? throw new AssetProcessingException($"No processor available for media type '{mediaType.Value}'.");

            job.MarkStep(MapProcessorStep(mediaType));
            buffer.Position = 0;
            var output = await processor.ProcessAsync(BuildContext(job, buffer), cancellationToken);

            if (output.Metadata.Count > 0)
            {
                job.RecordMetadata(output.Metadata);
            }

            foreach (var rendition in output.Renditions)
            {
                job.AddRendition(rendition);
            }

            job.MarkStep(ProcessingStep.ThumbnailGeneration);
            if (output.BlurPlaceholder is not null)
            {
                job.MarkStep(ProcessingStep.BlurPlaceholder);
            }

            job.MarkSucceeded();
            await _repository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Processing succeeded for job {JobId} (asset {AssetId}).", job.Id, job.AssetId);
            return new PipelineResult(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Processing failed for job {JobId} (asset {AssetId}).", job.Id, job.AssetId);
            job.MarkFailed(ex.Message);
            await _repository.SaveChangesAsync(cancellationToken);
            return new PipelineResult(false, ex.Message);
        }
    }

    private static ProcessingContext BuildContext(AssetProcessingJob job, Stream stream) =>
        new()
        {
            AssetId = job.AssetId,
            StorageKey = job.StorageKey,
            FileName = job.FileName,
            MimeType = job.MimeType,
            MediaType = job.MediaType,
            FileSize = job.FileSize,
            Source = stream,
            ExistingMetadata = new Dictionary<string, string>(job.ExtractedMetadata),
            Options = ProcessingOptions.Default
        };

    private static ProcessingStep MapProcessorStep(MediaType mediaType) => mediaType.Value switch
    {
        MediaType.ImageValue => ProcessingStep.ImageProcessing,
        MediaType.VideoValue => ProcessingStep.VideoProcessing,
        MediaType.AudioValue => ProcessingStep.AudioProcessing,
        MediaType.DocumentValue => ProcessingStep.DocumentProcessing,
        MediaType.ArchiveValue => ProcessingStep.ArchiveProcessing,
        _ => ProcessingStep.ImageProcessing
    };
}
