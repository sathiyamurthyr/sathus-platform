using Microsoft.EntityFrameworkCore;
using MediatR;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Infrastructure.Persistence;

namespace Sathus.Media.Infrastructure.Repositories;

public sealed class EfMediaFolderRepository : EfRepository<MediaFolder>, IMediaFolderRepository
{
    private readonly MediaDbContext _dbContext;

    public EfMediaFolderRepository(MediaDbContext dbContext, IMediator mediator) : base(dbContext, mediator)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<MediaFolder>> GetRootsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.MediaFolders
            .AsNoTracking()
            .Where(f => f.ParentFolderId == null)
            .OrderBy(f => f.SortOrder)
            .ThenBy(f => f.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<MediaFolder>> GetChildrenAsync(Guid parentFolderId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MediaFolders
            .AsNoTracking()
            .Where(f => f.ParentFolderId == parentFolderId)
            .OrderBy(f => f.SortOrder)
            .ThenBy(f => f.Name)
            .ToListAsync(cancellationToken);
    }
}
