namespace Sathus.Media.Application.Interfaces;

/// <summary>
/// Persists media audit log entries.
/// </summary>
public interface IMediaAuditService
{
    Task LogAsync(MediaAuditEntry entry, CancellationToken cancellationToken = default);
}
