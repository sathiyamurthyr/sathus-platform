namespace Sathus.Content.Domain.Entities;

public sealed class ContentItemCategory : BaseEntity
{
    public Guid ContentItemId { get; private set; }
    public Guid CategoryId { get; private set; }

    public ContentItem ContentItem { get; private set; } = null!;
    public Category Category { get; private set; } = null!;

    public ContentItemCategory(Guid contentItemId, Guid categoryId)
    {
        if (contentItemId == Guid.Empty) throw new ArgumentException("ContentItemId is required.", nameof(contentItemId));
        if (categoryId == Guid.Empty) throw new ArgumentException("CategoryId is required.", nameof(categoryId));

        Id = Guid.NewGuid();
        ContentItemId = contentItemId;
        CategoryId = categoryId;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    private ContentItemCategory() { }
}
