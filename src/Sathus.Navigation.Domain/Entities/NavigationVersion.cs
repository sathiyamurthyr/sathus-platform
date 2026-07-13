namespace Sathus.Navigation.Domain.Entities;

/// <summary>
/// An immutable snapshot of a menu used for versioning, preview, publish, schedule and rollback.
/// </summary>
public sealed class NavigationVersion : Entity
{
    public Guid MenuId { get; private set; }

    public int VersionNumber { get; private set; }

    public string Label { get; private set; } = string.Empty;

    public Sathus.Navigation.Domain.Enums.MenuStatus Status { get; private set; }

    public DateTime? PublishedAt { get; private set; }

    public DateTime? ScheduledAt { get; private set; }

    /// <summary>Serialized node tree snapshot (JSON).</summary>
    public string Snapshot { get; private set; } = "[]";

    public bool IsCurrent { get; private set; }

    private NavigationVersion()
    {
    }

    public static NavigationVersion Create(
        Guid menuId,
        int versionNumber,
        string label,
        string snapshot,
        Guid? createdBy,
        Sathus.Navigation.Domain.Enums.MenuStatus status = Sathus.Navigation.Domain.Enums.MenuStatus.Draft)
    {
        return new NavigationVersion
        {
            Id = Guid.NewGuid(),
            MenuId = menuId,
            VersionNumber = versionNumber,
            Label = label,
            Snapshot = snapshot,
            Status = status,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            IsCurrent = status is Sathus.Navigation.Domain.Enums.MenuStatus.Draft
        };
    }

    public void MarkPublished(DateTime at) => PublishedAt = at;

    public void MarkScheduled(DateTime at) => ScheduledAt = at;

    public void MarkCurrent(bool current) => IsCurrent = current;
}
