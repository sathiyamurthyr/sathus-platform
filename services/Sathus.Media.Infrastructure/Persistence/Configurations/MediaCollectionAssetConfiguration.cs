using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaCollectionAssetConfiguration : IEntityTypeConfiguration<MediaCollectionAsset>
{
    public void Configure(EntityTypeBuilder<MediaCollectionAsset> builder)
    {
        builder.ToTable("media_collection_assets");

        builder.HasKey(x => new { x.CollectionId, x.AssetId });

        builder.Property(x => x.CollectionId).HasColumnName("collection_id");
        builder.Property(x => x.AssetId).HasColumnName("asset_id");
        builder.Property(x => x.SortOrder).HasDefaultValue(0);

        builder.HasOne(x => x.Collection)
            .WithMany(c => c.Assets)
            .HasForeignKey(x => x.CollectionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Asset)
            .WithMany()
            .HasForeignKey(x => x.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.AssetId).HasDatabaseName("ix_media_collection_assets_asset");
    }
}
