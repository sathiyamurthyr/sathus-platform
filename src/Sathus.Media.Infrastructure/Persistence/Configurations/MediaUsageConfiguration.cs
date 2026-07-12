using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaUsageConfiguration : IEntityTypeConfiguration<MediaUsage>
{
    public void Configure(EntityTypeBuilder<MediaUsage> builder)
    {
        builder.ToTable("media_usages");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.AssetId).HasColumnName("asset_id");
        builder.Property(u => u.Context).IsRequired().HasMaxLength(64);
        builder.Property(u => u.ReferenceType).IsRequired().HasMaxLength(128);
        builder.Property(u => u.ReferenceId).IsRequired().HasMaxLength(256);
        builder.Property(u => u.Url).HasMaxLength(2048);
        builder.Property(u => u.Title).HasMaxLength(512);
        builder.Property(u => u.RecordedBy).HasColumnName("recorded_by");

        builder.HasOne(u => u.Asset)
            .WithMany(a => a.Usages)
            .HasForeignKey(u => u.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(u => u.AssetId).HasDatabaseName("ix_media_usages_asset");
        builder.HasIndex(u => new { u.Context, u.ReferenceId }).HasDatabaseName("ix_media_usages_context_reference");
    }
}
