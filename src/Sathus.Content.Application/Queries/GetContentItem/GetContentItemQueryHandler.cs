using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Exceptions;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Application.Queries.GetContentItem;

namespace Sathus.Content.Application.Queries.GetContentItem;

public sealed class GetContentItemQueryHandler : IRequestHandler<GetContentItemQuery, ContentItemDetailResponse>
{
    private readonly IContentItemRepository _contentItems;

    public GetContentItemQueryHandler(IContentItemRepository contentItems)
    {
        _contentItems = contentItems;
    }

    public async Task<ContentItemDetailResponse> Handle(GetContentItemQuery request, CancellationToken cancellationToken)
    {
        var contentItem = await _contentItems.GetByIdAsync(request.ContentItemId, cancellationToken);
        if (contentItem is null)
        {
            throw new ContentItemNotFoundException($"Content item '{request.ContentItemId}' was not found.");
        }

        var categoryNames = contentItem.Categories.Select(cc => cc.Category.Name).ToList();
        var tagNames = contentItem.Tags.Select(ct => ct.Tag.Name).ToList();

        return new ContentItemDetailResponse(
            contentItem.Id,
            contentItem.Title,
            contentItem.Slug.Value,
            contentItem.Description,
            contentItem.Body,
            contentItem.ContentType,
            contentItem.Status,
            contentItem.PublishedAt,
            contentItem.AuthorId,
            contentItem.SeoCanonical,
            contentItem.SeoRobots,
            contentItem.NoIndex,
            contentItem.OgImage,
            contentItem.FocusKeyword,
            contentItem.Featured,
            contentItem.NavigationTitle,
            contentItem.DisplayOrder,
            contentItem.PreviousContentItemId,
            contentItem.NextContentItemId,
            contentItem.Difficulty,
            contentItem.EstimatedReadTime,
            contentItem.Deprecated,
            contentItem.Tagline,
            contentItem.FeaturesJson,
            contentItem.PricingPlanId,
            contentItem.CoverImage,
            contentItem.ReadTime,
            contentItem.HeroImage,
            contentItem.GalleryJson,
            categoryNames,
            tagNames,
            contentItem.CreatedAt,
            contentItem.UpdatedAt);
    }
}
