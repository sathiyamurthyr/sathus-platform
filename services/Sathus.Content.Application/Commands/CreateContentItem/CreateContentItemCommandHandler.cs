using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Exceptions;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Domain.Events;
using Sathus.Content.Domain.ValueObjects;
using Sathus.Content.Application.Commands.CreateContentItem;

namespace Sathus.Content.Application.Commands.CreateContentItem;

public sealed class CreateContentItemCommandHandler : IRequestHandler<CreateContentItemCommand, ContentItemResponse>
{
    private readonly IContentItemRepository _contentItems;
    private readonly IAuditService _audit;

    public CreateContentItemCommandHandler(IContentItemRepository contentItems, IAuditService audit)
    {
        _contentItems = contentItems;
        _audit = audit;
    }

    public async Task<ContentItemResponse> Handle(CreateContentItemCommand request, CancellationToken cancellationToken)
    {
        var slug = Slug.Create(request.Slug);

        if (await _contentItems.ExistsBySlugAsync(slug.Value, cancellationToken))
        {
            throw new ContentItemAlreadyExistsException($"A content item with slug '{slug.Value}' already exists.");
        }

        var now = DateTime.UtcNow;
        var contentItem = new ContentItem(
            request.Title,
            slug,
            request.Body,
            request.ContentType,
            request.AuthorId);

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

        if (request.CategoryIds is not null)
        {
            foreach (var categoryId in request.CategoryIds)
            {
                if (categoryId != Guid.Empty)
                {
                    contentItem.Categories.Add(new ContentItemCategory(contentItem.Id, categoryId));
                }
            }
        }

        if (request.TagIds is not null)
        {
            foreach (var tagId in request.TagIds)
            {
                if (tagId != Guid.Empty)
                {
                    contentItem.Tags.Add(new ContentItemTag(contentItem.Id, tagId));
                }
            }
        }

        await _contentItems.AddAsync(contentItem, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("CreateContentItem", nameof(ContentItem), contentItem.Id, EntityId: contentItem.Id.ToString()),
            cancellationToken);

        return MapToResponse(contentItem);
    }

    private static ContentItemResponse MapToResponse(ContentItem item)
    {
        return new ContentItemResponse(
            item.Id,
            item.Title,
            item.Slug.Value,
            item.Description,
            item.ContentType,
            item.Status,
            item.PublishedAt,
            item.AuthorId,
            item.CreatedAt,
            item.UpdatedAt);
    }
}
