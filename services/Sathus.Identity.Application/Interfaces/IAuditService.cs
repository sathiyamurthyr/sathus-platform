using Sathus.Identity.Application.Interfaces;

namespace Sathus.Identity.Application.Interfaces;

public interface IAuditService
{
    Task LogAsync(AuditEntry entry, CancellationToken cancellationToken = default);
}
