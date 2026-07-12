namespace Sathus.Content.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Domain.Enums;

public class ContentItemConfiguration : IEntityTypeConfiguration<ContentItem>
{
    public void Configure(EntityTypeBuilder<ContentItem> builder)
    {
        builder.ToTable("content_items");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Title)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(c => c.Slug)
            .IsRequired()
            .HasMaxLength(256)
            .HasConversion(
                v => v.Value,
                v => Sathus.Content.Domain.ValueObjects.Slug.Create(v));

        builder.Property(c => c.Description)
            .HasMaxLength(512);

        builder.Property(c => c.Body)
            .IsRequired();

        builder.Property(c => c.ContentType)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(c => c.Status)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(c => c.PublishedAt);

        builder.Property(c => c.AuthorId);

        builder.Property(c => c.SeoCanonical)
            .HasMaxLength(1024);

        builder.Property(c => c.SeoRobots)
            .HasMaxLength(128);

        builder.Property(c => c.OgImage)
            .HasMaxLength(1024);

        builder.Property(c => c.FocusKeyword)
            .HasMaxLength(256);

        builder.Property(c => c.NavigationTitle)
            .HasMaxLength(256);

        builder.Property(c => c.Difficulty)
            .HasConversion<int>();

        builder.Property(c => c.FeaturesJson)
            .HasMaxLength(4000);

        builder.Property(c => c.GalleryJson)
            .HasMaxLength(4000);

        builder.HasIndex(c => c.Slug)
            .IsUnique();

        builder.HasIndex(c => new { c.ContentType, c.Status, c.PublishedAt });
        builder.HasIndex(c => new { c.ContentType, c.Status, c.DisplayOrder });

        builder.HasMany(c => c.Categories)
            .WithOne(cc => cc.ContentItem)
            .HasForeignKey(cc => cc.ContentItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.Tags)
            .WithOne(ct => ct.ContentItem)
            .HasForeignKey(ct => ct.ContentItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
