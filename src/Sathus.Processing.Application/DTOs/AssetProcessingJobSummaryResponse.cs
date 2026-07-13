namespace Sathus.Processing.Application.DTOs;

public sealed record AssetProcessingJobSummaryResponse(
    Guid Id,
    Guid AssetId,
    string FileName,
    string MediaType,
    string Status,
    string CurrentStep,
    int RetryCount,
    DateTime? StartedAt,
    DateTime? CompletedAt);
