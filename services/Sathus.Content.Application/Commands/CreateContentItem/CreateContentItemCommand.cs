using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Domain.Enums;

namespace Sathus.Content.Application.Commands.CreateContentItem;

public sealed record CreateContentItemCommand(
    string Title,
    string Slug,
    string Body,
    ContentType ContentType,
    string? Description = null,
    Guid? AuthorId = null,
    string? SeoCanonical = null,
    string? SeoRobots = null,
    bool NoIndex = false,
    string? OgImage = null,
    string? FocusKeyword = null,
    bool Featured = false,
    string? NavigationTitle = null,
    int? DisplayOrder = null,
    Guid? PreviousContentItemId = null,
    Guid? NextContentItemId = null,
    ContentDifficulty? Difficulty = null,
    int? EstimatedReadTime = null,
    bool Deprecated = false,
    string? Tagline = null,
    string? FeaturesJson = null,
    Guid? PricingPlanId = null,
    string? CoverImage = null,
    int? ReadTime = null,
    string? HeroImage = null,
    string? GalleryJson = null,
    IReadOnlyList<Guid>? CategoryIds = null,
    IReadOnlyList<Guid>? TagIds = null)
    : IRequest<ContentItemResponse>;
