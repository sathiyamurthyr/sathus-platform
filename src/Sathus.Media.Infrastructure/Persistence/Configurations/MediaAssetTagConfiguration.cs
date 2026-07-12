using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaAssetTagConfiguration : IEntityTypeConfiguration<MediaAssetTag>
{
    public void Configure(EntityTypeBuilder<MediaAssetTag> builder)
    {
        builder.ToTable("media_asset_tags");

        builder.HasKey(t => new { t.AssetId, t.TagId });

        builder.Property(t => t.AssetId).HasColumnName("asset_id");
        builder.Property(t => t.TagId).HasColumnName("tag_id");

        builder.HasOne(t => t.Asset)
            .WithMany(a => a.Tags)
            .HasForeignKey(t => t.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.Tag)
            .WithMany()
            .HasForeignKey(t => t.TagId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(t => t.TagId).HasDatabaseName("ix_media_asset_tags_tag");
    }
}
