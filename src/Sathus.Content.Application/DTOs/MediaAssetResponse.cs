namespace Sathus.Content.Application.DTOs;

public sealed record MediaAssetResponse(
    Guid Id,
    string Filename,
    string OriginalName,
    string MimeType,
    long Size,
    string Url,
    string? AltText);
