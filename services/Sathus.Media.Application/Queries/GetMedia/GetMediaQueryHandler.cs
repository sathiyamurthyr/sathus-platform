using MediatR;
using Sathus.Media.Application.DTOs;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Application.Specifications;
using Sathus.Media.Domain.Enums;
using Sathus.SharedKernel.Paging;

namespace Sathus.Media.Application.Queries.GetMedia;

public sealed class GetMediaQueryHandler
    : IRequestHandler<GetMediaQuery, PagedResult<MediaAssetSummaryResponse>>
{
    private readonly IMediaRepository _repository;

    public GetMediaQueryHandler(IMediaRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<MediaAssetSummaryResponse>> Handle(GetMediaQuery request, CancellationToken cancellationToken)
    {
        var status = string.IsNullOrWhiteSpace(request.Status)
            ? (MediaStatus?)null
            : Enum.TryParse<MediaStatus>(request.Status, ignoreCase: true, out var parsed) ? parsed : null;

        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        var items = await _repository.GetAsync(
            new MediaAssetFilterSpecification(
                request.FolderId,
                request.Type,
                status,
                request.TagId,
                request.Term,
                (page - 1) * pageSize,
                pageSize),
            cancellationToken);

        var total = await _repository.CountAsync(
            new MediaAssetFilterSpecification(
                request.FolderId,
                request.Type,
                status,
                request.TagId,
                request.Term),
            cancellationToken);

        return new PagedResult<MediaAssetSummaryResponse>(
            items.Select(MediaAssetSummaryResponse.From).ToList(), page, pageSize, total);
    }
}
