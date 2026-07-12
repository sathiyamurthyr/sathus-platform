using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// A reusable label that can be applied to many assets.
/// </summary>
public sealed class MediaTag : Entity
{
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public string? Color { get; private set; }
    public Guid? TenantId { get; private set; }

    private MediaTag()
    {
    }

    public MediaTag(string name, string slug, Guid? tenantId = null, string? description = null, string? color = null, Guid? createdBy = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(slug);

        Id = Guid.NewGuid();
        Name = name.Trim();
        Slug = slug.Trim().ToLowerInvariant();
        TenantId = tenantId;
        Description = description;
        Color = color;
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }

    public void Update(string name, string slug, string? description, string? color, Guid? updatedBy)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(slug);

        Name = name.Trim();
        Slug = slug.Trim().ToLowerInvariant();
        Description = description;
        Color = color;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }
}
