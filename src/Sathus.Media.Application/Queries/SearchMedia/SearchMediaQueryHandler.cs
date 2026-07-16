using MediatR;
using Sathus.Media.Application.DTOs;
using Sathus.Media.Application.Interfaces;
using Sathus.SharedKernel.Paging;

namespace Sathus.Media.Application.Queries.SearchMedia;

public sealed class SearchMediaQueryHandler
    : IRequestHandler<SearchMediaQuery, PagedResult<MediaAssetSummaryResponse>>
{
    private readonly IMediaSearchProvider _search;

    public SearchMediaQueryHandler(IMediaSearchProvider search)
    {
        _search = search;
    }

    public async Task<PagedResult<MediaAssetSummaryResponse>> Handle(SearchMediaQuery request, CancellationToken cancellationToken)
    {
        var criteria = new MediaSearchCriteria(
            request.Term,
            request.Types,
            request.Tags,
            request.FolderId,
            request.Status,
            request.Language,
            request.From,
            request.To,
            request.SortBy,
            request.Descending,
            Math.Max(1, request.Page),
            Math.Clamp(request.PageSize, 1, 100));

        var result = await _search.SearchAsync(criteria, cancellationToken);

        return new PagedResult<MediaAssetSummaryResponse>(
            result.Items.Select(MediaAssetSummaryResponse.From).ToList(),
            result.Page,
            result.PageSize,
            result.TotalCount);
    }
}
