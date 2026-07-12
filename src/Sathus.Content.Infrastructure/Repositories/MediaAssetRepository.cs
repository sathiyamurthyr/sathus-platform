namespace Sathus.Content.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Infrastructure.Persistence;

public class MediaAssetRepository(ContentDbContext dbContext) : IMediaAssetRepository
{
    private readonly DbSet<MediaAsset> _dbSet = dbContext.Set<MediaAsset>();

    public async Task<MediaAsset?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<MediaAsset>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.AsNoTracking().OrderByDescending(m => m.CreatedAt).ToListAsync(cancellationToken);
    }

    public async Task AddAsync(MediaAsset entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
    }

    public async Task UpdateAsync(MediaAsset entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(MediaAsset entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(entity);
        await Task.CompletedTask;
    }
}
