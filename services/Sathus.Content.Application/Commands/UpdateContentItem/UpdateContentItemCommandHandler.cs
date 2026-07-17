using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Exceptions;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Domain.Events;
using Sathus.Content.Domain.ValueObjects;
using Sathus.Content.Application.Commands.UpdateContentItem;

namespace Sathus.Content.Application.Commands.UpdateContentItem;

public sealed class UpdateContentItemCommandHandler : IRequestHandler<UpdateContentItemCommand, ContentItemResponse>
{
    private readonly IContentItemRepository _contentItems;
    private readonly IAuditService _audit;

    public UpdateContentItemCommandHandler(IContentItemRepository contentItems, IAuditService audit)
    {
        _contentItems = contentItems;
        _audit = audit;
    }

    public async Task<ContentItemResponse> Handle(UpdateContentItemCommand request, CancellationToken cancellationToken)
    {
        var contentItem = await _contentItems.GetByIdAsync(request.ContentItemId, cancellationToken);
        if (contentItem is null)
        {
            throw new ContentItemNotFoundException($"Content item '{request.ContentItemId}' was not found.");
        }

        var slug = Slug.Create(request.Slug);

        var now = DateTime.UtcNow;
        contentItem.Update(
            request.Title,
            slug,
            request.Description,
            request.Body,
            request.SeoCanonical,
            request.SeoRobots,
            request.NoIndex,
            request.OgImage,
            request.FocusKeyword,
            request.Featured,
            request.NavigationTitle,
            request.DisplayOrder,
            request.PreviousContentItemId,
            request.NextContentItemId,
            request.Difficulty,
            request.EstimatedReadTime,
            request.Deprecated,
            request.Tagline,
            request.FeaturesJson,
            request.PricingPlanId,
            request.CoverImage,
            request.ReadTime,
            request.HeroImage,
            request.GalleryJson,
            now);

        contentItem.Categories.Clear();
        if (request.CategoryIds is not null)
        {
            foreach (var categoryId in request.CategoryIds.Where(id => id != Guid.Empty))
            {
                contentItem.Categories.Add(new ContentItemCategory(contentItem.Id, categoryId));
            }
        }

        contentItem.Tags.Clear();
        if (request.TagIds is not null)
        {
            foreach (var tagId in request.TagIds.Where(id => id != Guid.Empty))
            {
                contentItem.Tags.Add(new ContentItemTag(contentItem.Id, tagId));
            }
        }

        await _contentItems.UpdateAsync(contentItem, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("UpdateContentItem", nameof(ContentItem), contentItem.Id, EntityId: contentItem.Id.ToString()),
            cancellationToken);

        return new ContentItemResponse(
            contentItem.Id,
            contentItem.Title,
            contentItem.Slug.Value,
            contentItem.Description,
            contentItem.ContentType,
            contentItem.Status,
            contentItem.PublishedAt,
            contentItem.AuthorId,
            contentItem.CreatedAt,
            contentItem.UpdatedAt);
    }
}
