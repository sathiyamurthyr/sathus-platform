using Sathus.MediaRelations.Domain.Enums;
using Sathus.SharedKernel.Entities;

namespace Sathus.MediaRelations.Domain.Entities;

/// <summary>
/// Append-only audit record capturing every mutation applied to a <see cref="MediaReference"/>.
/// Enables full reference history tracking and forensic analysis.
/// </summary>
public sealed class MediaReferenceHistory : AggregateRoot
{
    public Guid ReferenceId { get; private set; }
    public Guid AssetId { get; private set; }
    public ReferenceHistoryAction Action { get; private set; }
    public int Version { get; private set; }
    public ReferenceStatus StatusAfter { get; private set; }
    public string? Detail { get; private set; }
    public Guid? ActorId { get; private set; }
    public DateTime OccurredAt { get; private set; }

    private MediaReferenceHistory()
    {
    }

    public MediaReferenceHistory(
        Guid referenceId,
        Guid assetId,
        ReferenceHistoryAction action,
        int version,
        ReferenceStatus statusAfter,
        string? detail = null,
        Guid? actorId = null)
    {
        Id = Guid.NewGuid();
        ReferenceId = referenceId;
        AssetId = assetId;
        Action = action;
        Version = version;
        StatusAfter = statusAfter;
        Detail = detail;
        ActorId = actorId;
        OccurredAt = DateTime.UtcNow;
        SetCreationAudit(actorId, OccurredAt);
    }

    public static MediaReferenceHistory FromReference(
        MediaReference reference,
        ReferenceHistoryAction action,
        string? detail = null,
        Guid? actorId = null) =>
        new(reference.Id, reference.AssetId, action, reference.Version.Value, reference.Status, detail, actorId);
}
