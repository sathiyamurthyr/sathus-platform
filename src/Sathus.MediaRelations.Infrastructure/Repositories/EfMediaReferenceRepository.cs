using MediatR;
using Microsoft.EntityFrameworkCore;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;
using Sathus.MediaRelations.Infrastructure.Persistence;

namespace Sathus.MediaRelations.Infrastructure.Repositories;

public sealed class EfMediaReferenceRepository : EfRepository<MediaReference>, IMediaReferenceRepository
{
    public EfMediaReferenceRepository(MediaRelationsDbContext dbContext, IMediator mediator)
        : base(dbContext, mediator)
    {
    }

    public async Task<IReadOnlyList<MediaReference>> GetByAssetIdAsync(Guid assetId, bool includeInactive = false, CancellationToken cancellationToken = default)
    {
        var query = DbSet.Where(r => r.AssetId == assetId);
        if (!includeInactive)
        {
            query = query.Where(r => r.Status == ReferenceStatus.Active);
        }

        return await query
            .OrderByDescending(r => r.UpdatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<MediaReference>> GetBySourceAsync(string referenceType, string referenceId, CancellationToken cancellationToken = default)
    {
        var type = referenceType.Trim().ToLowerInvariant();
        var source = referenceId.Trim();
        return await DbSet
            .Where(r => r.ReferenceType.Value == type && r.SourceReferenceId.Value == source && r.Status != ReferenceStatus.Removed)
            .ToListAsync(cancellationToken);
    }

    public async Task<MediaReference?> GetByDeduplicationKeyAsync(string deduplicationKey, CancellationToken cancellationToken = default)
    {
        // Deduplication key is composed of asset id, module, type, source, usage type and path.
        // We evaluate it in memory over a narrowed candidate set to stay index-friendly.
        var parts = deduplicationKey.Split('|');
        if (parts.Length < 6 || !Guid.TryParse(parts[0], out var assetId))
        {
            return null;
        }

        var candidates = await DbSet
            .Where(r => r.AssetId == assetId)
            .ToListAsync(cancellationToken);

        return candidates.FirstOrDefault(r => r.DeduplicationKey == deduplicationKey);
    }

    public async Task<IReadOnlyList<MediaReference>> GetBrokenAsync(int skip, int take, CancellationToken cancellationToken = default) =>
        await DbSet
            .Where(r => r.Status == ReferenceStatus.Broken)
            .OrderByDescending(r => r.UpdatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);

    public async Task<int> CountActiveByAssetAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        await DbSet.CountAsync(r => r.AssetId == assetId && r.Status == ReferenceStatus.Active, cancellationToken);

    public async Task<int> CountBlockingByAssetAsync(Guid assetId, CancellationToken cancellationToken = default)
    {
        var active = await DbSet
            .Where(r => r.AssetId == assetId && r.Status == ReferenceStatus.Active)
            .ToListAsync(cancellationToken);
        return active.Count(r => r.IsBlockingDeletion);
    }

    public async Task<IReadOnlyList<Guid>> GetDistinctAssetIdsAsync(int skip, int take, CancellationToken cancellationToken = default) =>
        await DbSet
            .Select(r => r.AssetId)
            .Distinct()
            .OrderBy(id => id)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<MediaReference>> GetActiveBatchAsync(int skip, int take, CancellationToken cancellationToken = default) =>
        await DbSet
            .Where(r => r.Status == ReferenceStatus.Active)
            .OrderBy(r => r.Id)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);
}
