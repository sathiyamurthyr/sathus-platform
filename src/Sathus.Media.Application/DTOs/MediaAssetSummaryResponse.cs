namespace Sathus.Media.Application.DTOs;

/// <summary>
/// Lightweight asset representation for list and search results.
/// </summary>
public sealed record MediaAssetSummaryResponse(
    Guid Id,
    string FileName,
    string MimeType,
    string Type,
    string Status,
    long SizeBytes,
    string? AltText,
    Guid? FolderId,
    DateTime CreatedAt)
{
    public static MediaAssetSummaryResponse From(MediaAsset asset) => new(
        asset.Id,
        asset.FileName.Value,
        asset.MimeType.Value,
        asset.Type.Value,
        asset.Status.ToString(),
        asset.Size.Bytes,
        asset.AltText?.Value,
        asset.FolderId,
        asset.CreatedAt);
}
