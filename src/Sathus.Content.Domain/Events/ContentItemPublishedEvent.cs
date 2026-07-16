namespace Sathus.Content.Domain.Events;

using Sathus.Content.Domain.Enums;

public sealed class ContentItemPublishedEvent : DomainEvent
{
    public Guid ContentItemId { get; }
    public string Slug { get; }
    public ContentType ContentType { get; }

    public ContentItemPublishedEvent(Guid contentItemId, string slug, ContentType contentType)
    {
        ContentItemId = contentItemId;
        Slug = slug;
        ContentType = contentType;
    }
}
