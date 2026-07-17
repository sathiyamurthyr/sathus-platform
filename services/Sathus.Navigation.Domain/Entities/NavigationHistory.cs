using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Domain.Entities;

/// <summary>
/// An append-only ledger entry describing a navigation operation for audit and rollback context.
/// </summary>
public sealed class NavigationHistory : Entity
{
    public Guid TreeId { get; private set; }

    public Guid? MenuId { get; private set; }

    public HistoryOperation Operation { get; private set; }

    public Guid? ActorId { get; private set; }

    public string Payload { get; private set; } = "{}";

    public DateTime OccurredAt { get; private set; }

    public Guid? VersionId { get; private set; }

    private NavigationHistory()
    {
    }

    public static NavigationHistory Create(
        Guid treeId,
        HistoryOperation operation,
        Guid? menuId = null,
        Guid? actorId = null,
        string? payload = null,
        Guid? versionId = null)
    {
        return new NavigationHistory
        {
            Id = Guid.NewGuid(),
            TreeId = treeId,
            MenuId = menuId,
            Operation = operation,
            ActorId = actorId,
            Payload = payload ?? "{}",
            VersionId = versionId,
            OccurredAt = DateTime.UtcNow
        };
    }
}
