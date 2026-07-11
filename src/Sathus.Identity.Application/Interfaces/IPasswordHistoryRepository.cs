using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Interfaces;

public interface IPasswordHistoryRepository
{
    Task AddAsync(PasswordHistory entry, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PasswordHistory>> GetByUserAsync(
        Guid userId,
        int? limit = null,
        CancellationToken cancellationToken = default);
}
