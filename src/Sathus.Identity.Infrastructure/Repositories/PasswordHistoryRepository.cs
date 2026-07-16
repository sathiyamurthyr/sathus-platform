namespace Sathus.Identity.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Infrastructure.Persistence;

public class PasswordHistoryRepository(IdentityDbContext dbContext) : IPasswordHistoryRepository
{
    private readonly DbSet<PasswordHistory> _dbSet = dbContext.Set<PasswordHistory>();

    public async Task AddAsync(PasswordHistory entry, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entry, cancellationToken);
    }

    public async Task<IReadOnlyList<PasswordHistory>> GetByUserAsync(
        Guid userId,
        int? limit = null,
        CancellationToken cancellationToken = default)
    {
        IQueryable<PasswordHistory> query = _dbSet.AsNoTracking()
            .Where(ph => ph.UserId == userId)
            .OrderByDescending(ph => ph.CreatedAt);

        if (limit.HasValue)
        {
            query = query.Take(limit.Value);
        }

        return await query.ToListAsync(cancellationToken);
    }
}
