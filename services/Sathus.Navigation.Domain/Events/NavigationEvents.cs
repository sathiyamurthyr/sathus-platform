using Sathus.SharedKernel.Events;

namespace Sathus.Navigation.Domain.Events;

public sealed class NavigationTreeCreatedEvent : DomainEvent
{
    public Guid TreeId { get; }
    public NavigationTreeCreatedEvent(Guid treeId) => TreeId = treeId;
}

public sealed class NavigationMenuCreatedEvent : DomainEvent
{
    public Guid TreeId { get; }
    public Guid MenuId { get; }
    public NavigationMenuCreatedEvent(Guid treeId, Guid menuId)
    {
        TreeId = treeId;
        MenuId = menuId;
    }
}

public sealed class NavigationNodeCreatedEvent : DomainEvent
{
    public Guid MenuId { get; }
    public Guid NodeId { get; }
    public NavigationNodeCreatedEvent(Guid menuId, Guid nodeId)
    {
        MenuId = menuId;
        NodeId = nodeId;
    }
}

public sealed class NavigationNodeMovedEvent : DomainEvent
{
    public Guid MenuId { get; }
    public Guid NodeId { get; }
    public Guid? NewParentId { get; }
    public int NewOrder { get; }
    public NavigationNodeMovedEvent(Guid menuId, Guid nodeId, Guid? newParentId, int newOrder)
    {
        MenuId = menuId;
        NodeId = nodeId;
        NewParentId = newParentId;
        NewOrder = newOrder;
    }
}

public sealed class NavigationMenuPublishedEvent : DomainEvent
{
    public Guid TreeId { get; }
    public Guid MenuId { get; }
    public Guid VersionId { get; }
    public NavigationMenuPublishedEvent(Guid treeId, Guid menuId, Guid versionId)
    {
        TreeId = treeId;
        MenuId = menuId;
        VersionId = versionId;
    }
}

public sealed class NavigationMenuScheduledEvent : DomainEvent
{
    public Guid MenuId { get; }
    public Guid VersionId { get; }
    public DateTime ScheduledAt { get; }
    public NavigationMenuScheduledEvent(Guid menuId, Guid versionId, DateTime scheduledAt)
    {
        MenuId = menuId;
        VersionId = versionId;
        ScheduledAt = scheduledAt;
    }
}

public sealed class NavigationMenuRolledBackEvent : DomainEvent
{
    public Guid MenuId { get; }
    public Guid FromVersionId { get; }
    public Guid ToVersionId { get; }
    public NavigationMenuRolledBackEvent(Guid menuId, Guid fromVersionId, Guid toVersionId)
    {
        MenuId = menuId;
        FromVersionId = fromVersionId;
        ToVersionId = toVersionId;
    }
}

public sealed class NavigationMenuArchivedEvent : DomainEvent
{
    public Guid MenuId { get; }
    public NavigationMenuArchivedEvent(Guid menuId) => MenuId = menuId;
}
