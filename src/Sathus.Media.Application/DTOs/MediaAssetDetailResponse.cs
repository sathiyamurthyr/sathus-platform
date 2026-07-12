using Sathus.SharedKernel.Paging;

namespace Sathus.Media.Application.DTOs;

/// <summary>
/// Detailed asset representation including related entities.
/// </summary>
public sealed record MediaAssetDetailResponse(
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
    IReadOnlyList<MediaTagResponse> Tags,
    int UsageCount,
    int VersionCount,
    int MetadataCount,
    DateTime CreatedAt,
    DateTime UpdatedAt)
{
    public static MediaAssetDetailResponse From(MediaAsset asset) => new(
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
        asset.Tags.Select(t => MediaTagResponse.From(t.Tag!)).ToList(),
        asset.Usages.Count,
        asset.Versions.Count,
        asset.Metadata.Count,
        asset.CreatedAt,
        asset.UpdatedAt);

    public static PagedResult<MediaAssetSummaryResponse> ToPaged(
        IReadOnlyList<MediaAsset> assets, int page, int pageSize, int total) =>
        new(assets.Select(MediaAssetSummaryResponse.From).ToList(), page, pageSize, total);
}
