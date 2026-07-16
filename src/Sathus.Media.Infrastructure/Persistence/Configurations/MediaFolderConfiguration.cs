using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaFolderConfiguration : IEntityTypeConfiguration<MediaFolder>
{
    public void Configure(EntityTypeBuilder<MediaFolder> builder)
    {
        builder.ToTable("media_folders");

        builder.HasKey(f => f.Id);

        builder.Property(f => f.Name).IsRequired().HasMaxLength(256);
        builder.Property(f => f.Slug).IsRequired().HasMaxLength(256);
        builder.Property(f => f.Description).HasMaxLength(1000);
        builder.Property(f => f.ParentFolderId).HasColumnName("parent_folder_id");
        builder.Property(f => f.OwnerId).HasColumnName("owner_id");
        builder.Property(f => f.TenantId).HasColumnName("tenant_id");
        builder.Property(f => f.SortOrder).HasDefaultValue(0);

        builder.HasIndex(f => f.ParentFolderId).HasDatabaseName("ix_media_folders_parent");
        builder.HasIndex(f => new { f.TenantId, f.Slug }).IsUnique().HasDatabaseName("ix_media_folders_tenant_slug");
    }
}
