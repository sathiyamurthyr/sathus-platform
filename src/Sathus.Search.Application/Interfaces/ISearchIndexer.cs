using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Application.Interfaces;

public interface ISearchIndexer
{
    Task IndexAsync(SearchDocument document, CancellationToken cancellationToken);
    Task IndexRangeAsync(IEnumerable<SearchDocument> documents, CancellationToken cancellationToken);
    Task DeleteAsync(Guid documentId, CancellationToken cancellationToken);
    Task DeleteBySourceAsync(IndexSourceType sourceType, CancellationToken cancellationToken);
    Task RebuildAsync(Guid indexId, CancellationToken cancellationToken);
    Task<int> GetPendingCountAsync(CancellationToken cancellationToken);
}
