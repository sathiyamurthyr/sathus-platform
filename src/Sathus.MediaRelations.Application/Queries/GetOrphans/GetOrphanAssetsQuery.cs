using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.SharedKernel.Paging;

namespace Sathus.MediaRelations.Application.Queries.GetOrphans;

/// <summary>
/// Returns assets that are tracked but currently have no active references
/// (orphan / unused assets), paged.
/// </summary>
public sealed record GetOrphanAssetsQuery(int Page = 1, int PageSize = 50)
    : IRequest<PagedResult<UsageStatisticsResponse>>;
