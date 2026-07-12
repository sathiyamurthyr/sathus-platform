using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.Enums;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaShareConfiguration : IEntityTypeConfiguration<MediaShare>
{
    public void Configure(EntityTypeBuilder<MediaShare> builder)
    {
        builder.ToTable("media_shares");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.AssetId).HasColumnName("asset_id");
        builder.Property(s => s.ShareType).HasConversion<int>().IsRequired();
        builder.Property(s => s.SharedWith).IsRequired().HasMaxLength(512);
        builder.Property(s => s.AccessLevel).HasConversion<int>().IsRequired();
        builder.Property(s => s.Token).HasMaxLength(128);
        builder.Property(s => s.ExpiresAt).HasColumnName("expires_at");
        builder.Property(s => s.IsRevoked).HasDefaultValue(false);
        builder.Property(s => s.CreatedBy).HasColumnName("created_by");

        builder.HasOne(s => s.Asset)
            .WithMany(a => a.Shares)
            .HasForeignKey(s => s.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(s => s.AssetId).HasDatabaseName("ix_media_shares_asset");
        builder.HasIndex(s => s.Token).HasDatabaseName("ix_media_shares_token");
    }
}
