namespace Sathus.Content.Domain.Entities;

public sealed class AuditLog : BaseEntity
{
    public string Action { get; private set; } = string.Empty;
    public string EntityType { get; private set; } = string.Empty;
    public string EntityId { get; private set; } = string.Empty;
    public string? Changes { get; private set; }
    public string? IpAddress { get; private set; }
    public Guid? ActorId { get; private set; }
    public string? ActorEmail { get; private set; }

    public AuditLog(
        string action,
        string entityType,
        string entityId,
        string? changes = null,
        string? ipAddress = null,
        Guid? actorId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(action);
        ArgumentException.ThrowIfNullOrWhiteSpace(entityType);
        ArgumentException.ThrowIfNullOrWhiteSpace(entityId);

        Id = Guid.NewGuid();
        Action = action;
        EntityType = entityType;
        EntityId = entityId;
        Changes = changes;
        IpAddress = ipAddress;
        ActorId = actorId;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    private AuditLog() { }
}
