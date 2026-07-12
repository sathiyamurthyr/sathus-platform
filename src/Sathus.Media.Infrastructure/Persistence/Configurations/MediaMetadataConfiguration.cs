using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.ValueObjects;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaMetadataConfiguration : IEntityTypeConfiguration<MediaMetadata>
{
    public void Configure(EntityTypeBuilder<MediaMetadata> builder)
    {
        builder.ToTable("media_metadata");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.AssetId).HasColumnName("asset_id");
        builder.Property(m => m.Key).IsRequired().HasMaxLength(128);
        builder.Property(m => m.Value).IsRequired().HasMaxLength(4096);
        builder.OwnsOne(m => m.Language, v => v.Property(p => p.Value).HasColumnName("language_code").HasMaxLength(LanguageCode.MaxLength));

        builder.HasOne(m => m.Asset)
            .WithMany(a => a.Metadata)
            .HasForeignKey(m => m.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(m => new { m.AssetId, m.Key }).HasDatabaseName("ix_media_metadata_asset_key");
    }
}
