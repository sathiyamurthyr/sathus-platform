using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// Append-only audit record for media operations. Backed by the media_audit_logs table.
/// </summary>
public sealed class MediaAudit : Entity
{
    public Guid? AssetId { get; private set; }
    public string Action { get; private set; } = string.Empty;
    public Guid? ActorId { get; private set; }
    public string? Details { get; private set; }
    public string? IpAddress { get; private set; }
    public string? CorrelationId { get; private set; }

    public MediaAsset? Asset { get; set; }

    private MediaAudit()
    {
    }

    public MediaAudit(
        string action,
        Guid? assetId = null,
        Guid? actorId = null,
        string? details = null,
        string? ipAddress = null,
        string? correlationId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(action);

        Id = Guid.NewGuid();
        Action = action.Trim();
        AssetId = assetId;
        ActorId = actorId;
        Details = details;
        IpAddress = ipAddress;
        CorrelationId = correlationId;
        SetCreationAudit(actorId, DateTime.UtcNow);
    }
}
