using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Interfaces;

public interface ILoginHistoryRepository
{
    Task AddAsync(LoginHistory entry, CancellationToken cancellationToken = default);

    Task<PagedResult<LoginHistory>> GetByUserPagedAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    Task<int> CountRecentFailuresAsync(
        Guid userId,
        DateTime since,
        CancellationToken cancellationToken = default);
}
