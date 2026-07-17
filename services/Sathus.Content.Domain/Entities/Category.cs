namespace Sathus.Content.Domain.Entities;

public sealed class Category : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string? Description { get; private set; }

    public ICollection<ContentItemCategory> ContentItems { get; } = new List<ContentItemCategory>();

    public Category(string name, string slug)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(slug);
        if (name.Length > 128) throw new ArgumentException("Name exceeds maximum length of 128.", nameof(name));
        if (slug.Length > 128) throw new ArgumentException("Slug exceeds maximum length of 128.", nameof(slug));

        Id = Guid.NewGuid();
        Name = name;
        Slug = slug;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(string name, string? description)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        if (name.Length > 128) throw new ArgumentException("Name exceeds maximum length of 128.", nameof(name));

        Name = name;
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }
}
