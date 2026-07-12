namespace Sathus.Media.Application.DTOs;

/// <summary>
/// Full representation of a media asset.
/// </summary>
public sealed record MediaAssetResponse(
    Guid Id,
    string FileName,
    string FileExtension,
    string MimeType,
    long SizeBytes,
    string Checksum,
    string StorageKey,
    string? AltText,
    string Type,
    string Status,
    string Language,
    int? Width,
    int? Height,
    double? DurationSeconds,
    string? Hash,
    Guid? FolderId,
    Guid? OwnerId,
    Guid? TenantId,
    string? Title,
    string? Description,
    DateTime CreatedAt,
    DateTime UpdatedAt)
{
    public static MediaAssetResponse From(MediaAsset asset) => new(
        asset.Id,
        asset.FileName.Value,
        asset.FileExtension.Value,
        asset.MimeType.Value,
        asset.Size.Bytes,
        asset.Checksum.Value,
        asset.StorageKey.Value,
        asset.AltText?.Value,
        asset.Type.Value,
        asset.Status.ToString(),
        asset.Language.Value,
        asset.Dimensions?.Width,
        asset.Dimensions?.Height,
        asset.Duration?.TotalSeconds,
        asset.Hash?.Value,
        asset.FolderId,
        asset.OwnerId,
        asset.TenantId,
        asset.Title,
        asset.Description,
        asset.CreatedAt,
        asset.UpdatedAt);
}
