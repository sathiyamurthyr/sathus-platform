namespace Sathus.Identity.Infrastructure.Repositories;

using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Infrastructure.Persistence;

public class LoginHistoryRepository(IdentityDbContext dbContext) : ILoginHistoryRepository
{
    private readonly DbSet<LoginHistory> _dbSet = dbContext.Set<LoginHistory>();

    public async Task AddAsync(LoginHistory entry, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entry, cancellationToken);
    }

    public async Task<PagedResult<LoginHistory>> GetByUserPagedAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsNoTracking().Where(lh => lh.UserId == userId);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(lh => lh.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<LoginHistory>(items, page, pageSize, totalCount);
    }

    public async Task<int> CountRecentFailuresAsync(
        Guid userId,
        DateTime since,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(
            lh => lh.UserId == userId && lh.Status == Domain.Enums.LoginStatus.Failed && lh.CreatedAt >= since,
            cancellationToken);
    }
}
