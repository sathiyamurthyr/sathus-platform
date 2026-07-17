using System.Linq;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Media.Infrastructure.Persistence;

namespace Sathus.Media.Infrastructure.Repositories;

public sealed class EfMediaRepository : EfRepository<MediaAsset>, IMediaRepository
{
    private readonly MediaDbContext _dbContext;

    public EfMediaRepository(MediaDbContext dbContext, IMediator mediator) : base(dbContext, mediator)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<MediaAsset>> GetByFolderIdAsync(Guid? folderId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MediaAssets
            .AsNoTracking()
            .Where(a => a.FolderId == folderId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<MediaAsset?> GetByStorageKeyAsync(StorageKey storageKey, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MediaAssets
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.StorageKey.Value == storageKey.Value, cancellationToken);
    }

    public async Task<IReadOnlyList<MediaAsset>> GetByChecksumAsync(Checksum checksum, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MediaAssets
            .AsNoTracking()
            .Where(a => a.Checksum.Value == checksum.Value)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<MediaAsset>> GetByTagAsync(Guid tagId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MediaAssets
            .AsNoTracking()
            .Where(a => a.Tags.Any(t => t.TagId == tagId))
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
