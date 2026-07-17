using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.SharedKernel.Paging;

namespace Sathus.MediaRelations.Application.Queries.GetOrphans;

public sealed class GetOrphanAssetsQueryHandler
    : IRequestHandler<GetOrphanAssetsQuery, PagedResult<UsageStatisticsResponse>>
{
    private readonly IMediaUsageStatisticsRepository _statistics;

    public GetOrphanAssetsQueryHandler(IMediaUsageStatisticsRepository statistics)
    {
        _statistics = statistics;
    }

    public async Task<PagedResult<UsageStatisticsResponse>> Handle(GetOrphanAssetsQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize is < 1 or > 500 ? 50 : request.PageSize;

        var spec = new UnusedStatisticsSpecification();
        var total = await _statistics.CountAsync(spec, cancellationToken);
        var items = await _statistics.GetUnusedAsync((page - 1) * pageSize, pageSize, cancellationToken);

        return new PagedResult<UsageStatisticsResponse>(
            items.Select(UsageStatisticsResponse.From).ToList(),
            page,
            pageSize,
            total);
    }
}

/// <summary>Statistics rows for assets with no active references.</summary>
public sealed class UnusedStatisticsSpecification : Sathus.SharedKernel.Specifications.Specification<MediaUsageStatistics>
{
    public UnusedStatisticsSpecification()
    {
        AddCriteria(s => s.ReferenceCount == 0);
        ApplyOrderBy(s => s.UnusedSince!);
    }
}
