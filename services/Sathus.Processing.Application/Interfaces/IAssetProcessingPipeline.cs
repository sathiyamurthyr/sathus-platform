using Sathus.Processing.Domain.Entities;

namespace Sathus.Processing.Application.Interfaces;

/// <summary>
/// Outcome of running a single processing job through the pipeline.
/// </summary>
public sealed record PipelineResult(bool Succeeded, string? ErrorMessage = null);

/// <summary>
/// Orchestrates the full asset processing pipeline for a single job: validation,
/// virus scan, metadata extraction, checksum, duplicate detection and the
/// registered asset processor. Implemented in the infrastructure layer.
/// </summary>
public interface IAssetProcessingPipeline
{
    Task<PipelineResult> ExecuteAsync(AssetProcessingJob job, CancellationToken cancellationToken = default);
}
