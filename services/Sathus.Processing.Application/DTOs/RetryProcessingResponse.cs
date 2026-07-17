namespace Sathus.Processing.Application.DTOs;

public sealed record RetryProcessingResponse(Guid JobId, string Status, int RetryCount);
