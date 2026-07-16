namespace Sathus.Content.Domain.Events;

public sealed class ContentItemArchivedEvent : DomainEvent
{
    public Guid ContentItemId { get; }

    public ContentItemArchivedEvent(Guid contentItemId)
    {
        ContentItemId = contentItemId;
    }
}
