using Microsoft.EntityFrameworkCore;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.Media.Infrastructure.Persistence;

namespace Sathus.MediaRelations.Infrastructure.Services;

/// <summary>
/// Resolves asset existence against the DAM Foundation (Media module) database. Keeps the
/// engine decoupled from Media domain internals behind <see cref="IAssetExistenceChecker"/>.
/// </summary>
public sealed class MediaAssetExistenceChecker : IAssetExistenceChecker
{
    private readonly MediaDbContext _mediaDbContext;

    public MediaAssetExistenceChecker(MediaDbContext mediaDbContext)
    {
        _mediaDbContext = mediaDbContext;
    }

    public async Task<bool> ExistsAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        await _mediaDbContext.MediaAssets
            .AsNoTracking()
            .AnyAsync(a => a.Id == assetId && !a.IsDeleted, cancellationToken);

    public async Task<IReadOnlySet<Guid>> ExistingAsync(IReadOnlyCollection<Guid> assetIds, CancellationToken cancellationToken = default)
    {
        if (assetIds.Count == 0)
        {
            return new HashSet<Guid>();
        }

        var ids = assetIds.Distinct().ToList();
        var existing = await _mediaDbContext.MediaAssets
            .AsNoTracking()
            .Where(a => ids.Contains(a.Id) && !a.IsDeleted)
            .Select(a => a.Id)
            .ToListAsync(cancellationToken);

        return existing.ToHashSet();
    }
}
