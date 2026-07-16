using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaCollectionConfiguration : IEntityTypeConfiguration<MediaCollection>
{
    public void Configure(EntityTypeBuilder<MediaCollection> builder)
    {
        builder.ToTable("media_collections");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(256);
        builder.Property(c => c.Slug).IsRequired().HasMaxLength(256);
        builder.Property(c => c.Description).HasMaxLength(2000);
        builder.Property(c => c.OwnerId).HasColumnName("owner_id");
        builder.Property(c => c.TenantId).HasColumnName("tenant_id");
        builder.Property(c => c.CoverAssetId).HasColumnName("cover_asset_id");
        builder.Property(c => c.IsPublished).HasDefaultValue(false);
        builder.Property(c => c.SortOrder).HasDefaultValue(0);

        builder.HasIndex(c => new { c.TenantId, c.Slug }).IsUnique().HasDatabaseName("ix_media_collections_tenant_slug");
    }
}
