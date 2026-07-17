namespace Sathus.Upload.Application.DTOs;

public sealed record UploadChunkResponse(
    int ChunkIndex,
    string Status,
    string? StorageKey,
    DateTime? CompletedAt);
