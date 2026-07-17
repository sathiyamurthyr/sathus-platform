using Microsoft.AspNetCore.Http;

namespace Sathus.Upload.Api.DTOs;

public sealed record UploadChunkRequest(
    Guid SessionId,
    int ChunkIndex,
    IFormFile Data,
    string? Checksum = null);
