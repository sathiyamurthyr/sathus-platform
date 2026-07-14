using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Application.Interfaces;

public interface ISearchRepository
{
    Task<SearchDocument?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<SearchDocument?> GetByExternalIdAsync(Guid indexId, string externalId, CancellationToken cancellationToken = default);
    Task<SearchIndex?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<SearchIndex?> GetIndexWithDocumentsAsync(Guid indexId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SearchDocument>> GetByIndexAsync(Guid indexId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SearchDocument>> GetBySourceTypeAsync(IndexSourceType sourceType, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SearchIndex>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SearchIndex>> GetEnabledAsync(CancellationToken cancellationToken = default);
    Task AddAsync(SearchDocument entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(SearchDocument entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(SearchDocument entity, CancellationToken cancellationToken = default);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
