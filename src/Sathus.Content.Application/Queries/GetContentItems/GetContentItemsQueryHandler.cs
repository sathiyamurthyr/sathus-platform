using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Application.Queries.GetContentItems;

namespace Sathus.Content.Application.Queries.GetContentItems;

public sealed class GetContentItemsQueryHandler : IRequestHandler<GetContentItemsQuery, PagedResult<ContentItemResponse>>
{
    private readonly IContentItemRepository _contentItems;

    public GetContentItemsQueryHandler(IContentItemRepository contentItems)
    {
        _contentItems = contentItems;
    }

    public async Task<PagedResult<ContentItemResponse>> Handle(GetContentItemsQuery request, CancellationToken cancellationToken)
    {
        var result = await _contentItems.GetPagedAsync(
            request.Page,
            request.PageSize,
            request.ContentType,
            request.Status,
            request.CategoryId,
            request.TagId,
            request.Search,
            request.SortBy,
            request.SortDescending,
            cancellationToken);

        var items = result.Items.Select(item => new ContentItemResponse(
            item.Id,
            item.Title,
            item.Slug.Value,
            item.Description,
            item.ContentType,
            item.Status,
            item.PublishedAt,
            item.AuthorId,
            item.CreatedAt,
            item.UpdatedAt)).ToList();

        return new PagedResult<ContentItemResponse>(items, result.Page, result.PageSize, result.TotalCount);
    }
}
