namespace Sathus.Media.Application.DTOs;

public sealed record MediaTagResponse(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    string? Color,
    Guid? TenantId)
{
    public static MediaTagResponse From(MediaTag tag) => new(
        tag.Id, tag.Name, tag.Slug, tag.Description, tag.Color, tag.TenantId);
}

public sealed record MediaFolderResponse(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    Guid? ParentFolderId,
    Guid? TenantId,
    int SortOrder)
{
    public static MediaFolderResponse From(MediaFolder folder) => new(
        folder.Id, folder.Name, folder.Slug, folder.Description, folder.ParentFolderId, folder.TenantId, folder.SortOrder);
}

public sealed record FolderTreeNode(
    Guid Id,
    string Name,
    string Slug,
    Guid? ParentFolderId,
    int SortOrder,
    IReadOnlyList<FolderTreeNode> Children)
{
    public static FolderTreeNode From(MediaFolder folder, IReadOnlyList<FolderTreeNode> children) => new(
        folder.Id, folder.Name, folder.Slug, folder.ParentFolderId, folder.SortOrder, children);
}

public sealed record FolderTreeResponse(IReadOnlyList<FolderTreeNode> Roots)
{
}

public sealed record MediaCollectionResponse(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    Guid? CoverAssetId,
    bool IsPublished,
    int AssetCount)
{
    public static MediaCollectionResponse From(MediaCollection collection) => new(
        collection.Id, collection.Name, collection.Slug, collection.Description,
        collection.CoverAssetId, collection.IsPublished, collection.Assets.Count);
}

public sealed record MediaUsageResponse(
    Guid Id,
    Guid AssetId,
    string Context,
    string ReferenceType,
    string ReferenceId,
    string? Url,
    string? Title)
{
    public static MediaUsageResponse From(MediaUsage usage) => new(
        usage.Id, usage.AssetId, usage.Context, usage.ReferenceType, usage.ReferenceId, usage.Url, usage.Title);
}

public sealed record MediaVersionResponse(
    Guid Id,
    Guid AssetId,
    int VersionNumber,
    string FileName,
    string FileExtension,
    string MimeType,
    long SizeBytes,
    string Checksum,
    string StorageKey,
    string? Note,
    DateTime CreatedAt)
{
    public static MediaVersionResponse From(MediaVersion version) => new(
        version.Id, version.AssetId, version.VersionNumber, version.FileName.Value, version.FileExtension.Value,
        version.MimeType.Value, version.Size.Bytes, version.Checksum.Value, version.StorageKey.Value, version.Note, version.CreatedAt);
}

public sealed record MediaAuditResponse(
    Guid Id,
    Guid? AssetId,
    string Action,
    Guid? ActorId,
    string? Details,
    string? IpAddress,
    string? CorrelationId,
    DateTime CreatedAt)
{
    public static MediaAuditResponse From(MediaAudit audit) => new(
        audit.Id, audit.AssetId, audit.Action, audit.ActorId, audit.Details, audit.IpAddress, audit.CorrelationId, audit.CreatedAt);
}

public sealed record MediaShareResponse(
    Guid Id,
    Guid AssetId,
    string ShareType,
    string SharedWith,
    string AccessLevel,
    string? Token,
    DateTime? ExpiresAt,
    bool IsRevoked)
{
    public static MediaShareResponse From(MediaShare share) => new(
        share.Id, share.AssetId, share.ShareType.ToString(), share.SharedWith, share.AccessLevel.ToString(),
        share.Token, share.ExpiresAt, share.IsRevoked);
}

public sealed record MediaPermissionResponse(
    Guid Id,
    Guid? AssetId,
    Guid? FolderId,
    Guid? TenantId,
    Guid PrincipalId,
    string PrincipalType,
    string Permission,
    Guid? GrantedBy,
    DateTime? ExpiresAt)
{
    public static MediaPermissionResponse From(MediaPermission permission) => new(
        permission.Id, permission.AssetId, permission.FolderId, permission.TenantId, permission.PrincipalId,
        permission.PrincipalType.ToString(), permission.Permission, permission.GrantedBy, permission.ExpiresAt);
}

public sealed record MediaMetadataResponse(
    Guid Id,
    Guid AssetId,
    string Key,
    string Value,
    string? Language)
{
    public static MediaMetadataResponse From(MediaMetadata metadata) => new(
        metadata.Id, metadata.AssetId, metadata.Key, metadata.Value, metadata.Language?.Value);
}
