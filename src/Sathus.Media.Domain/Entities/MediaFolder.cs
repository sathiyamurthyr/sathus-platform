using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// A folder organising assets in a hierarchical tree.
/// </summary>
public sealed class MediaFolder : Entity
{
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public Guid? ParentFolderId { get; private set; }
    public Guid? OwnerId { get; private set; }
    public Guid? TenantId { get; private set; }
    public int SortOrder { get; private set; }

    private MediaFolder()
    {
    }

    public MediaFolder(
        string name,
        string slug,
        Guid? parentFolderId = null,
        Guid? ownerId = null,
        Guid? tenantId = null,
        string? description = null,
        int sortOrder = 0,
        Guid? createdBy = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(slug);

        Id = Guid.NewGuid();
        Name = name.Trim();
        Slug = slug.Trim().ToLowerInvariant();
        ParentFolderId = parentFolderId;
        OwnerId = ownerId;
        TenantId = tenantId;
        Description = description;
        SortOrder = sortOrder;
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }

    public void Rename(string name, string slug, Guid? updatedBy)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(slug);

        Name = name.Trim();
        Slug = slug.Trim().ToLowerInvariant();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void Move(Guid? parentFolderId, Guid? updatedBy)
    {
        ParentFolderId = parentFolderId;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void UpdateDescription(string? description, Guid? updatedBy)
    {
        Description = description;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }
}
