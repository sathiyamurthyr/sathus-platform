namespace Sathus.Content.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Content.Domain.Entities;

public class ContentItemTagConfiguration : IEntityTypeConfiguration<ContentItemTag>
{
    public void Configure(EntityTypeBuilder<ContentItemTag> builder)
    {
        builder.ToTable("content_item_tags");

        builder.HasKey(ct => new { ct.ContentItemId, ct.TagId });

        builder.HasOne(ct => ct.ContentItem)
            .WithMany(c => c.Tags)
            .HasForeignKey(ct => ct.ContentItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ct => ct.Tag)
            .WithMany(t => t.ContentItems)
            .HasForeignKey(ct => ct.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
