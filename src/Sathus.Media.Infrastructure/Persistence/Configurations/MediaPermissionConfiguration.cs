using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.Enums;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaPermissionConfiguration : IEntityTypeConfiguration<MediaPermission>
{
    public void Configure(EntityTypeBuilder<MediaPermission> builder)
    {
        builder.ToTable("media_permissions");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.AssetId).HasColumnName("asset_id");
        builder.Property(p => p.FolderId).HasColumnName("folder_id");
        builder.Property(p => p.TenantId).HasColumnName("tenant_id");
        builder.Property(p => p.PrincipalId).HasColumnName("principal_id");
        builder.Property(p => p.PrincipalType).HasConversion<int>().IsRequired();
        builder.Property(p => p.Permission).IsRequired().HasMaxLength(64);
        builder.Property(p => p.GrantedBy).HasColumnName("granted_by");
        builder.Property(p => p.ExpiresAt).HasColumnName("expires_at");

        builder.HasIndex(p => new { p.AssetId, p.PrincipalId, p.Permission }).HasDatabaseName("ix_media_permissions_asset_principal");
        builder.HasIndex(p => new { p.FolderId, p.PrincipalId, p.Permission }).HasDatabaseName("ix_media_permissions_folder_principal");
    }
}
