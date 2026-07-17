namespace Sathus.Media.Application.Interfaces;

/// <summary>
/// Record of a media operation to be persisted into the media audit log.
/// </summary>
public sealed record MediaAuditEntry(
    string Action,
    Guid? AssetId = null,
    Guid? ActorId = null,
    string? Details = null,
    string? IpAddress = null,
    string? CorrelationId = null);
