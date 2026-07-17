using Microsoft.EntityFrameworkCore;
using MediatR;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Infrastructure.Persistence;

namespace Sathus.Media.Infrastructure.Repositories;

public sealed class EfMediaUsageRepository : EfRepository<MediaUsage>, IMediaUsageRepository
{
    private readonly MediaDbContext _dbContext;

    public EfMediaUsageRepository(MediaDbContext dbContext, IMediator mediator) : base(dbContext, mediator)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<MediaUsage>> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MediaUsages
            .AsNoTracking()
            .Where(u => u.AssetId == assetId)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<MediaUsage>> GetByContextAsync(string context, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MediaUsages
            .AsNoTracking()
            .Where(u => u.Context == context)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
