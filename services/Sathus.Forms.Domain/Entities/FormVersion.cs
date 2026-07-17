using Sathus.Forms.Domain.Enums;

namespace Sathus.Forms.Domain.Entities;

/// <summary>
/// An immutable snapshot of a form's structure at a point in time. Used for version history,
/// publishing and rollback. Snapshots are serialized JSON produced by <c>Form.BuildSnapshot()</c>.
/// </summary>
public sealed class FormVersion : Entity
{
    public Guid FormId { get; private set; }

    public int VersionNumber { get; private set; }

    public string Label { get; private set; } = string.Empty;

    public FormStatus Status { get; private set; } = FormStatus.Draft;

    public string Snapshot { get; private set; } = "[]";

    public bool IsCurrent { get; private set; }

    public DateTime? PublishedAt { get; private set; }

    private FormVersion()
    {
    }

    public static FormVersion Create(Guid formId, int versionNumber, string label, string snapshot, Guid? createdBy = null) =>
        new()
        {
            Id = Guid.NewGuid(),
            FormId = formId,
            VersionNumber = versionNumber,
            Label = (label ?? $"v{versionNumber}").Trim(),
            Snapshot = snapshot,
            Status = FormStatus.Draft,
            IsCurrent = false,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

    public void MarkPublished(DateTime at, Guid? updatedBy = null)
    {
        Status = FormStatus.Published;
        PublishedAt = at;
        SetUpdateAudit(updatedBy, at);
    }

    public void MarkCurrent(bool current)
    {
        IsCurrent = current;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkArchived(DateTime at, Guid? updatedBy = null)
    {
        Status = FormStatus.Archived;
        SetUpdateAudit(updatedBy, at);
    }
}
