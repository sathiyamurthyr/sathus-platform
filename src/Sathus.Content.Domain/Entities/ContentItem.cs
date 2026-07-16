using System;
using System.Collections.Generic;
using Sathus.Content.Domain.Enums;
using Sathus.Content.Domain.Events;
using Sathus.Content.Domain.Interfaces;
using Sathus.Content.Domain.ValueObjects;

namespace Sathus.Content.Domain.Entities;

public sealed class ContentItem : BaseEntity, IAggregateRoot
{
    public string Title { get; private set; } = string.Empty;
    public Slug Slug { get; private set; } = null!;
    public string? Description { get; private set; }
    public string Body { get; private set; } = string.Empty;
    public ContentType ContentType { get; private set; }
    public ContentStatus Status { get; private set; }
    public DateTime? PublishedAt { get; private set; }
    public Guid? AuthorId { get; private set; }

    public string? SeoCanonical { get; private set; }
    public string? SeoRobots { get; private set; }
    public bool NoIndex { get; private set; }
    public string? OgImage { get; private set; }
    public string? FocusKeyword { get; private set; }
    public bool Featured { get; private set; }

    public string? NavigationTitle { get; private set; }
    public int? DisplayOrder { get; private set; }
    public Guid? PreviousContentItemId { get; private set; }
    public Guid? NextContentItemId { get; private set; }
    public ContentDifficulty? Difficulty { get; private set; }
    public int? EstimatedReadTime { get; private set; }
    public bool Deprecated { get; private set; }

    public string? Tagline { get; private set; }
    public string? FeaturesJson { get; private set; }
    public Guid? PricingPlanId { get; private set; }
    public string? CoverImage { get; private set; }
    public int? ReadTime { get; private set; }
    public string? HeroImage { get; private set; }
    public string? GalleryJson { get; private set; }

    public ICollection<ContentItemCategory> Categories { get; } = new List<ContentItemCategory>();
    public ICollection<ContentItemTag> Tags { get; } = new List<ContentItemTag>();

    public ContentItem(
        string title,
        Slug slug,
        string body,
        ContentType contentType,
        Guid? authorId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(body);
        ArgumentNullException.ThrowIfNull(slug);

        if (title.Length > 256) throw new ArgumentException("Title exceeds maximum length of 256.", nameof(title));
        if (body.Length > 100000) throw new ArgumentException("Body exceeds maximum length of 100,000.", nameof(body));

        Id = Guid.NewGuid();
        Title = title;
        Slug = slug;
        Body = body;
        ContentType = contentType;
        Status = ContentStatus.Draft;
        AuthorId = authorId;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(
        string title,
        Slug slug,
        string? description,
        string body,
        string? seoCanonical,
        string? seoRobots,
        bool noIndex,
        string? ogImage,
        string? focusKeyword,
        bool featured,
        string? navigationTitle,
        int? displayOrder,
        Guid? previousContentItemId,
        Guid? nextContentItemId,
        ContentDifficulty? difficulty,
        int? estimatedReadTime,
        bool deprecated,
        string? tagline,
        string? featuresJson,
        Guid? pricingPlanId,
        string? coverImage,
        int? readTime,
        string? heroImage,
        string? galleryJson,
        DateTime updatedAt)
    {
        if (title.Length > 256) throw new ArgumentException("Title exceeds maximum length of 256.", nameof(title));
        if (body.Length > 100000) throw new ArgumentException("Body exceeds maximum length of 100,000.", nameof(body));

        Title = title;
        Slug = slug;
        Description = description;
        Body = body;
        SeoCanonical = seoCanonical;
        SeoRobots = seoRobots;
        NoIndex = noIndex;
        OgImage = ogImage;
        FocusKeyword = focusKeyword;
        Featured = featured;
        NavigationTitle = navigationTitle;
        DisplayOrder = displayOrder;
        PreviousContentItemId = previousContentItemId;
        NextContentItemId = nextContentItemId;
        Difficulty = difficulty;
        EstimatedReadTime = estimatedReadTime;
        Deprecated = deprecated;
        Tagline = tagline;
        FeaturesJson = featuresJson;
        PricingPlanId = pricingPlanId;
        CoverImage = coverImage;
        ReadTime = readTime;
        HeroImage = heroImage;
        GalleryJson = galleryJson;
        UpdatedAt = updatedAt;
    }

    public void Publish(DateTime publishedAt)
    {
        if (publishedAt > DateTime.UtcNow.AddMinutes(5))
        {
            throw new ArgumentOutOfRangeException(nameof(publishedAt), "PublishedAt cannot be in the distant future.");
        }

        Status = ContentStatus.Published;
        PublishedAt = publishedAt;
        UpdatedAt = publishedAt;
    }

    public void Unpublish()
    {
        Status = ContentStatus.Draft;
        PublishedAt = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Archive()
    {
        Status = ContentStatus.Archived;
        UpdatedAt = DateTime.UtcNow;
    }
}
