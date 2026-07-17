namespace Sathus.Content.Application.Interfaces;

public sealed record AuditEntry(
    string Action,
    string EntityName,
    Guid? UserId,
    string? EntityId = null,
    string? Changes = null,
    string? IpAddress = null);
