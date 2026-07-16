namespace Sathus.Media.Api.Requests;

/// <summary>
/// Request body for creating a media asset. Actor identity is taken from the JWT, not the body.
/// </summary>
public sealed record CreateMediaAssetRequest(
    string FileName,
    string FileExtension,
    string MimeType,
    long Size,
    string Checksum,
    string StorageKey,
    string Type,
    string Language,
    string? AltText = null,
    Guid? FolderId = null,
    Guid? OwnerId = null,
    Guid? TenantId = null,
    string? InitialStatus = "Draft",
    int? Width = null,
    int? Height = null,
    double? DurationSeconds = null,
    string? Hash = null,
    string? Title = null,
    string? Description = null);

/// <summary>
/// Request body for updating asset metadata.
/// </summary>
public sealed record UpdateMediaMetadataRequest(
    string? AltText = null,
    string? Language = null,
    string? Title = null,
    string? Description = null,
    Guid? FolderId = null);
