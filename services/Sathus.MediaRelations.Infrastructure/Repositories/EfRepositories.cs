using MediatR;
using Microsoft.EntityFrameworkCore;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Infrastructure.Persistence;

namespace Sathus.MediaRelations.Infrastructure.Repositories;

public sealed class EfMediaUsageRepository : EfRepository<MediaUsage>, IMediaUsageRepository
{
    public EfMediaUsageRepository(MediaRelationsDbContext dbContext, IMediator mediator)
        : base(dbContext, mediator)
    {
    }

    public async Task<MediaUsage?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        var parts = key.Split('|');
        if (parts.Length < 4 || !Guid.TryParse(parts[0], out var assetId))
        {
            return null;
        }

        var candidates = await DbSet.Where(u => u.AssetId == assetId).ToListAsync(cancellationToken);
        return candidates.FirstOrDefault(u => u.Key == key);
    }

    public async Task<IReadOnlyList<MediaUsage>> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        await DbSet.Where(u => u.AssetId == assetId).ToListAsync(cancellationToken);
}

public sealed class EfMediaRelationRepository : EfRepository<MediaRelation>, IMediaRelationRepository
{
    public EfMediaRelationRepository(MediaRelationsDbContext dbContext, IMediator mediator)
        : base(dbContext, mediator)
    {
    }

    public async Task<IReadOnlyList<MediaRelation>> GetByTargetNodeAsync(string targetNodeKey, CancellationToken cancellationToken = default) =>
        await DbSet.Where(r => r.TargetNodeKey == targetNodeKey).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<MediaRelation>> GetBySourceNodeAsync(string sourceNodeKey, CancellationToken cancellationToken = default) =>
        await DbSet.Where(r => r.SourceNodeKey == sourceNodeKey).ToListAsync(cancellationToken);

    public async Task<MediaRelation?> GetByDeduplicationKeyAsync(string deduplicationKey, CancellationToken cancellationToken = default)
    {
        var candidates = await DbSet.ToListAsync(cancellationToken);
        return candidates.FirstOrDefault(r => r.DeduplicationKey == deduplicationKey);
    }

    public async Task<IReadOnlyList<MediaRelation>> GetAllEdgesAsync(CancellationToken cancellationToken = default) =>
        await DbSet.AsNoTracking().ToListAsync(cancellationToken);
}

public sealed class EfMediaDependencyRepository : EfRepository<MediaDependency>, IMediaDependencyRepository
{
    public EfMediaDependencyRepository(MediaRelationsDbContext dbContext, IMediator mediator)
        : base(dbContext, mediator)
    {
    }

    public async Task<IReadOnlyList<MediaDependency>> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        await DbSet.Where(d => d.AssetId == assetId).ToListAsync(cancellationToken);

    public async Task RemoveByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default)
    {
        var existing = await DbSet.Where(d => d.AssetId == assetId).ToListAsync(cancellationToken);
        DbSet.RemoveRange(existing);
    }
}

public sealed class EfMediaReferenceHistoryRepository : EfRepository<MediaReferenceHistory>, IMediaReferenceHistoryRepository
{
    public EfMediaReferenceHistoryRepository(MediaRelationsDbContext dbContext, IMediator mediator)
        : base(dbContext, mediator)
    {
    }

    public async Task<IReadOnlyList<MediaReferenceHistory>> GetByReferenceIdAsync(Guid referenceId, CancellationToken cancellationToken = default) =>
        await DbSet.AsNoTracking()
            .Where(h => h.ReferenceId == referenceId)
            .OrderBy(h => h.OccurredAt)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<MediaReferenceHistory>> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        await DbSet.AsNoTracking()
            .Where(h => h.AssetId == assetId)
            .OrderBy(h => h.OccurredAt)
            .ToListAsync(cancellationToken);
}

public sealed class EfMediaUsageStatisticsRepository : EfRepository<MediaUsageStatistics>, IMediaUsageStatisticsRepository
{
    public EfMediaUsageStatisticsRepository(MediaRelationsDbContext dbContext, IMediator mediator)
        : base(dbContext, mediator)
    {
    }

    public async Task<MediaUsageStatistics?> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        await DbSet.FirstOrDefaultAsync(s => s.AssetId == assetId, cancellationToken);

    public async Task<IReadOnlyList<MediaUsageStatistics>> GetMostUsedAsync(int take, CancellationToken cancellationToken = default) =>
        await DbSet.AsNoTracking()
            .OrderByDescending(s => s.UsageCount)
            .Take(take)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<MediaUsageStatistics>> GetUnusedAsync(int skip, int take, CancellationToken cancellationToken = default) =>
        await DbSet.AsNoTracking()
            .Where(s => s.ReferenceCount == 0)
            .OrderBy(s => s.UnusedSince)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);
}

public sealed class EfMediaReferenceSnapshotRepository : EfRepository<MediaReferenceSnapshot>, IMediaReferenceSnapshotRepository
{
    public EfMediaReferenceSnapshotRepository(MediaRelationsDbContext dbContext, IMediator mediator)
        : base(dbContext, mediator)
    {
    }

    public async Task<IReadOnlyList<MediaReferenceSnapshot>> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        await DbSet.AsNoTracking()
            .Where(s => s.AssetId == assetId)
            .OrderByDescending(s => s.CapturedAt)
            .ToListAsync(cancellationToken);

    public async Task<MediaReferenceSnapshot?> GetLatestAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        await DbSet.AsNoTracking()
            .Where(s => s.AssetId == assetId)
            .OrderByDescending(s => s.CapturedAt)
            .FirstOrDefaultAsync(cancellationToken);
}

public sealed class EfMediaRelationshipGraphRepository : EfRepository<MediaRelationshipGraph>, IMediaRelationshipGraphRepository
{
    public EfMediaRelationshipGraphRepository(MediaRelationsDbContext dbContext, IMediator mediator)
        : base(dbContext, mediator)
    {
    }

    public async Task<MediaRelationshipGraph?> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        await DbSet
            .Include(g => g.Nodes)
            .Include(g => g.Edges)
            .FirstOrDefaultAsync(g => g.RootAssetId == assetId, cancellationToken);

    public async Task RemoveByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default)
    {
        var existing = await DbSet
            .Include(g => g.Nodes)
            .Include(g => g.Edges)
            .Where(g => g.RootAssetId == assetId)
            .ToListAsync(cancellationToken);
        DbSet.RemoveRange(existing);
    }
}
