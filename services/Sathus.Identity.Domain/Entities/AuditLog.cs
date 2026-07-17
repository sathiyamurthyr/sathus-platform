using System;

namespace Sathus.Identity.Domain.Entities;

public sealed class AuditLog : BaseEntity
{
    public Guid? ActorId { get; private set; }
    public string? ActorEmail { get; private set; }
    public string Action { get; private set; } = string.Empty;
    public string EntityType { get; private set; } = string.Empty;
    public string EntityId { get; private set; } = string.Empty;
    public string? Changes { get; private set; }
    public string? IpAddress { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public AuditLog(string? actorEmail, string action, string entityType, string entityId, string? changes, string? ipAddress, Guid? actorId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(action);
        if (action.Length > 128) throw new ArgumentException("Action exceeds maximum length of 128.", nameof(action));
        if (actorEmail is { Length: > 256 }) throw new ArgumentException("ActorEmail exceeds maximum length of 256.", nameof(actorEmail));
        if (entityType.Length > 128) throw new ArgumentException("EntityType exceeds maximum length of 128.", nameof(entityType));
        if (entityId.Length > 128) throw new ArgumentException("EntityId exceeds maximum length of 128.", nameof(entityId));
        if (ipAddress is { Length: > 64 }) throw new ArgumentException("IpAddress exceeds maximum length of 64.", nameof(ipAddress));

        Id = Guid.NewGuid();
        ActorId = actorId;
        ActorEmail = actorEmail;
        Action = action;
        EntityType = entityType;
        EntityId = entityId;
        Changes = changes;
        IpAddress = ipAddress;
        CreatedAt = DateTime.UtcNow;
    }

    private AuditLog() { }
}
