using Sathus.SharedKernel.Events;

namespace Sathus.Media.Domain.Events;

public sealed class MediaCreatedEvent : DomainEvent
{
    public Guid AssetId { get; }

    public MediaCreatedEvent(Guid assetId) => AssetId = assetId;
}

public sealed class MediaUpdatedEvent : DomainEvent
{
    public Guid AssetId { get; }

    public MediaUpdatedEvent(Guid assetId) => AssetId = assetId;
}

public sealed class MediaArchivedEvent : DomainEvent
{
    public Guid AssetId { get; }

    public MediaArchivedEvent(Guid assetId) => AssetId = assetId;
}

public sealed class MediaDeletedEvent : DomainEvent
{
    public Guid AssetId { get; }

    public MediaDeletedEvent(Guid assetId) => AssetId = assetId;
}

public sealed class MediaRestoredEvent : DomainEvent
{
    public Guid AssetId { get; }

    public MediaRestoredEvent(Guid assetId) => AssetId = assetId;
}
