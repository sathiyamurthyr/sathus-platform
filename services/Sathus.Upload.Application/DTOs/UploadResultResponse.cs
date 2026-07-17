namespace Sathus.Upload.Application.DTOs;

public sealed record UploadResultResponse(
    Guid SessionId,
    string SessionIdentifier,
    string Status,
    string? StorageKey,
    string? ErrorMessage,
    DateTime? CompletedAt);
