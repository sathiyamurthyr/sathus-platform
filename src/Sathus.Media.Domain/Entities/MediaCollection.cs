using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// A curated collection of assets (gallery, album, product set, etc.).
/// </summary>
public sealed class MediaCollection : Entity
{
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public Guid? OwnerId { get; private set; }
    public Guid? TenantId { get; private set; }
    public Guid? CoverAssetId { get; private set; }
    public bool IsPublished { get; private set; }
    public int SortOrder { get; private set; }

    public ICollection<MediaCollectionAsset> Assets { get; } = new List<MediaCollectionAsset>();

    private MediaCollection()
    {
    }

    public MediaCollection(
        string name,
        string slug,
        Guid? ownerId = null,
        Guid? tenantId = null,
        string? description = null,
        Guid? createdBy = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(slug);

        Id = Guid.NewGuid();
        Name = name.Trim();
        Slug = slug.Trim().ToLowerInvariant();
        OwnerId = ownerId;
        TenantId = tenantId;
        Description = description;
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }

    public void Update(string name, string slug, string? description, bool isPublished, Guid? updatedBy)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(slug);

        Name = name.Trim();
        Slug = slug.Trim().ToLowerInvariant();
        Description = description;
        IsPublished = isPublished;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void SetCover(Guid? coverAssetId, Guid? updatedBy)
    {
        CoverAssetId = coverAssetId;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void AddAsset(Guid assetId, int? sortOrder = null)
    {
        if (Assets.Any(a => a.AssetId == assetId))
        {
            return;
        }

        Assets.Add(new MediaCollectionAsset(Id, assetId, sortOrder ?? Assets.Count));
    }

    public void RemoveAsset(Guid assetId)
    {
        var item = Assets.FirstOrDefault(a => a.AssetId == assetId);
        if (item is not null)
        {
            Assets.Remove(item);
        }
    }
}
