namespace Sathus.Content.Domain.Entities;

public sealed class ContentItemTag : BaseEntity
{
    public Guid ContentItemId { get; private set; }
    public Guid TagId { get; private set; }

    public ContentItem ContentItem { get; private set; } = null!;
    public Tag Tag { get; private set; } = null!;

    public ContentItemTag(Guid contentItemId, Guid tagId)
    {
        if (contentItemId == Guid.Empty) throw new ArgumentException("ContentItemId is required.", nameof(contentItemId));
        if (tagId == Guid.Empty) throw new ArgumentException("TagId is required.", nameof(tagId));

        Id = Guid.NewGuid();
        ContentItemId = contentItemId;
        TagId = tagId;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    private ContentItemTag() { }
}
