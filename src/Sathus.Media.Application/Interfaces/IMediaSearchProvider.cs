using Sathus.Media.Domain.Entities;
using Sathus.SharedKernel.Paging;

namespace Sathus.Media.Application.Interfaces;

/// <summary>
/// Abstraction over a search engine. The PostgreSQL implementation is provided in the
/// infrastructure layer; alternative providers (Meilisearch, OpenSearch, Elastic) can be
/// added without coupling the application to any concrete technology.
/// </summary>
public interface IMediaSearchProvider
{
    Task<PagedResult<MediaAsset>> SearchAsync(MediaSearchCriteria criteria, CancellationToken cancellationToken = default);

    Task IndexAsync(MediaAsset asset, CancellationToken cancellationToken = default);

    Task RemoveAsync(Guid assetId, CancellationToken cancellationToken = default);
}
