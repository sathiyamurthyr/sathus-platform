using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.ValueObjects;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaVersionConfiguration : IEntityTypeConfiguration<MediaVersion>
{
    public void Configure(EntityTypeBuilder<MediaVersion> builder)
    {
        builder.ToTable("media_versions");

        builder.HasKey(v => v.Id);

        builder.Property(v => v.AssetId).HasColumnName("asset_id");
        builder.Property(v => v.VersionNumber).IsRequired();
        builder.Property(v => v.Note).HasMaxLength(1000);
        builder.Property(v => v.CreatedBy).HasColumnName("created_by");

        builder.OwnsOne(v => v.FileName, p => p.Property(x => x.Value).HasColumnName("file_name").HasMaxLength(FileName.MaxLength).IsRequired());
        builder.OwnsOne(v => v.FileExtension, p => p.Property(x => x.Value).HasColumnName("file_extension").HasMaxLength(FileExtension.MaxLength).IsRequired());
        builder.OwnsOne(v => v.MimeType, p => p.Property(x => x.Value).HasColumnName("mime_type").HasMaxLength(MimeType.MaxLength).IsRequired());
        builder.OwnsOne(v => v.Size, p => p.Property(x => x.Bytes).HasColumnName("size_bytes").IsRequired());
        builder.OwnsOne(v => v.Checksum, p => p.Property(x => x.Value).HasColumnName("checksum").HasMaxLength(Checksum.MaxLength).IsRequired());
        builder.OwnsOne(v => v.StorageKey, p => p.Property(x => x.Value).HasColumnName("storage_key").HasMaxLength(StorageKey.MaxLength).IsRequired());

        builder.HasOne(v => v.Asset)
            .WithMany(a => a.Versions)
            .HasForeignKey(v => v.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(v => v.AssetId).HasDatabaseName("ix_media_versions_asset");
        builder.HasIndex(v => new { v.AssetId, v.VersionNumber }).IsUnique().HasDatabaseName("ix_media_versions_asset_version");
    }
}
