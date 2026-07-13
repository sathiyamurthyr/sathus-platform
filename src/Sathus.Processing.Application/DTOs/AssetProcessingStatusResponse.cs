namespace Sathus.Processing.Application.DTOs;

public sealed record AssetProcessingStatusResponse(
    Guid AssetId,
    string Status,
    string CurrentStep,
    int RetryCount,
    int MaxRetries,
    string? ErrorMessage,
    DateTime? StartedAt,
    DateTime? CompletedAt,
    int RenditionCount);
