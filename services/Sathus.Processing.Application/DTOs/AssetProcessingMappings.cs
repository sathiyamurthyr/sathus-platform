using System.Collections.Generic;
using Sathus.Processing.Domain.Entities;
using Sathus.Processing.Domain.ValueObjects;

namespace Sathus.Processing.Application.DTOs;

internal static class AssetProcessingMappings
{
    public static RenditionResponse ToResponse(this Rendition rendition) =>
        new(rendition.Kind.ToString(), rendition.Format, rendition.Width, rendition.Height, rendition.SizeBytes, rendition.StorageKey, rendition.Url);

    public static AssetProcessingJobResponse ToResponse(this AssetProcessingJob job) =>
        new(
            job.Id,
            job.AssetId,
            job.StorageKey,
            job.FileName,
            job.MimeType,
            job.MediaTypeValue,
            job.Status.ToString(),
            job.CurrentStep.ToString(),
            job.RetryCount,
            job.MaxRetries,
            job.ErrorMessage,
            job.Checksum,
            job.DuplicateOfAssetId,
            job.Renditions.Select(ToResponse).ToList(),
            new Dictionary<string, string>(job.ExtractedMetadata),
            job.StartedAt,
            job.CompletedAt);

    public static AssetProcessingJobSummaryResponse ToSummary(this AssetProcessingJob job) =>
        new(
            job.Id,
            job.AssetId,
            job.FileName,
            job.MediaTypeValue,
            job.Status.ToString(),
            job.CurrentStep.ToString(),
            job.RetryCount,
            job.StartedAt,
            job.CompletedAt);

    public static AssetProcessingStatusResponse ToStatus(this AssetProcessingJob job) =>
        new(
            job.AssetId,
            job.Status.ToString(),
            job.CurrentStep.ToString(),
            job.RetryCount,
            job.MaxRetries,
            job.ErrorMessage,
            job.StartedAt,
            job.CompletedAt,
            job.Renditions.Count);
}
