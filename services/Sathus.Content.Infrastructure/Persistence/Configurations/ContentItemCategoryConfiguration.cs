namespace Sathus.Content.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Content.Domain.Entities;

public class ContentItemCategoryConfiguration : IEntityTypeConfiguration<ContentItemCategory>
{
    public void Configure(EntityTypeBuilder<ContentItemCategory> builder)
    {
        builder.ToTable("content_item_categories");

        builder.HasKey(cc => new { cc.ContentItemId, cc.CategoryId });

        builder.HasOne(cc => cc.ContentItem)
            .WithMany(c => c.Categories)
            .HasForeignKey(cc => cc.ContentItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cc => cc.Category)
            .WithMany(c => c.ContentItems)
            .HasForeignKey(cc => cc.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
