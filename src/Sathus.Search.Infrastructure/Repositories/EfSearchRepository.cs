using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Sathus.Search.Application.Interfaces;
using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Search.Infrastructure.Repositories;

public sealed class EfSearchRepository : EfRepository<SearchDocument>, ISearchRepository
{
    private readonly SearchDbContext _dbContext;

    public EfSearchRepository(SearchDbContext dbContext, IMediator mediator) : base(dbContext, mediator)
    {
        _dbContext = dbContext;
    }

    public async Task<SearchDocument?> GetByExternalIdAsync(Guid indexId, string externalId, CancellationToken cancellationToken = default) =>
        await _dbContext.SearchDocuments
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.IndexId == indexId && d.ExternalId == externalId, cancellationToken);

    public async Task<SearchIndex?> GetByCodeAsync(string code, CancellationToken cancellationToken = default) =>
        await _dbContext.SearchIndexes
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Code == code, cancellationToken);

    public async Task<SearchIndex?> GetIndexWithDocumentsAsync(Guid indexId, CancellationToken cancellationToken = default) =>
        await _dbContext.SearchIndexes
            .AsNoTracking()
            .Include(i => i.Fields)
            .Include(i => i.Facets)
            .Include(i => i.Synonyms)
            .Include(i => i.Rankings)
            .Include(i => i.Highlights)
            .FirstOrDefaultAsync(i => i.Id == indexId, cancellationToken);

    public async Task<IReadOnlyList<SearchDocument>> GetByIndexAsync(Guid indexId, CancellationToken cancellationToken = default) =>
        await _dbContext.SearchDocuments
            .AsNoTracking()
            .Where(d => d.IndexId == indexId)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<SearchDocument>> GetBySourceTypeAsync(IndexSourceType sourceType, CancellationToken cancellationToken = default) =>
        await _dbContext.SearchDocuments
            .AsNoTracking()
            .Where(d => d.SourceType == sourceType)
            .ToListAsync(cancellationToken);

    public new async Task<IReadOnlyList<SearchIndex>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _dbContext.SearchIndexes
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<SearchIndex>> GetEnabledAsync(CancellationToken cancellationToken = default) =>
        await _dbContext.SearchIndexes
            .AsNoTracking()
            .Where(i => i.IsEnabled)
            .ToListAsync(cancellationToken);
}
