using System.Collections.Generic;

namespace Sathus.Processing.Application.DTOs;

public sealed record AssetProcessingJobResponse(
    Guid Id,
    Guid AssetId,
    string StorageKey,
    string FileName,
    string MimeType,
    string MediaType,
    string Status,
    string CurrentStep,
    int RetryCount,
    int MaxRetries,
    string? ErrorMessage,
    string? Checksum,
    Guid? DuplicateOfAssetId,
    IReadOnlyList<RenditionResponse> Renditions,
    IReadOnlyDictionary<string, string> ExtractedMetadata,
    DateTime? StartedAt,
    DateTime? CompletedAt);
