using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaTagConfiguration : IEntityTypeConfiguration<MediaTag>
{
    public void Configure(EntityTypeBuilder<MediaTag> builder)
    {
        builder.ToTable("media_tags");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name).IsRequired().HasMaxLength(128);
        builder.Property(t => t.Slug).IsRequired().HasMaxLength(128);
        builder.Property(t => t.Description).HasMaxLength(1000);
        builder.Property(t => t.Color).HasMaxLength(32);
        builder.Property(t => t.TenantId).HasColumnName("tenant_id");

        builder.HasIndex(t => new { t.TenantId, t.Name }).IsUnique().HasDatabaseName("ix_media_tags_tenant_name");
        builder.HasIndex(t => new { t.TenantId, t.Slug }).IsUnique().HasDatabaseName("ix_media_tags_tenant_slug");
    }
}
