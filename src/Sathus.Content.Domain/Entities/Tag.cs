namespace Sathus.Content.Domain.Entities;

public sealed class Tag : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;

    public ICollection<ContentItemTag> ContentItems { get; } = new List<ContentItemTag>();

    public Tag(string name, string slug)
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

    public void Rename(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        if (name.Length > 128) throw new ArgumentException("Name exceeds maximum length of 128.", nameof(name));

        Name = name;
        UpdatedAt = DateTime.UtcNow;
    }
}
