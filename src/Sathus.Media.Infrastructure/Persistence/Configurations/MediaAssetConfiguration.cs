using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.ValueObjects;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaAssetConfiguration : IEntityTypeConfiguration<MediaAsset>
{
    public void Configure(EntityTypeBuilder<MediaAsset> builder)
    {
        builder.ToTable("media_assets");

        builder.HasKey(a => a.Id);

        builder.OwnsOne(a => a.FileName, v => v.Property(p => p.Value).HasColumnName("file_name").HasMaxLength(FileName.MaxLength).IsRequired());
        builder.OwnsOne(a => a.FileExtension, v => v.Property(p => p.Value).HasColumnName("file_extension").HasMaxLength(FileExtension.MaxLength).IsRequired());
        builder.OwnsOne(a => a.MimeType, v => v.Property(p => p.Value).HasColumnName("mime_type").HasMaxLength(MimeType.MaxLength).IsRequired());
        builder.OwnsOne(a => a.Size, v => v.Property(p => p.Bytes).HasColumnName("size_bytes").IsRequired());
        builder.OwnsOne(a => a.Checksum, v => v.Property(p => p.Value).HasColumnName("checksum").HasMaxLength(Checksum.MaxLength).IsRequired());
        builder.OwnsOne(a => a.StorageKey, v => v.Property(p => p.Value).HasColumnName("storage_key").HasMaxLength(StorageKey.MaxLength).IsRequired());
        builder.OwnsOne(a => a.AltText, v => v.Property(p => p.Value).HasColumnName("alt_text").HasMaxLength(AltText.MaxLength));
        builder.OwnsOne(a => a.Type, v => v.Property(p => p.Value).HasColumnName("media_type").HasMaxLength(32).IsRequired());
        builder.OwnsOne(a => a.Language, v => v.Property(p => p.Value).HasColumnName("language_code").HasMaxLength(LanguageCode.MaxLength).IsRequired());
        builder.OwnsOne(a => a.Dimensions, d =>
        {
            d.Property(p => p.Width).HasColumnName("width");
            d.Property(p => p.Height).HasColumnName("height");
        });
        builder.OwnsOne(a => a.Duration, v => v.Property(p => p.Value).HasColumnName("duration").HasColumnType("interval"));
        builder.OwnsOne(a => a.Hash, v => v.Property(p => p.Value).HasColumnName("content_hash").HasMaxLength(Hash.MaxLength));

        builder.Property(a => a.Status).HasConversion<int>().IsRequired();
        builder.Property(a => a.FolderId).HasColumnName("folder_id");
        builder.Property(a => a.OwnerId).HasColumnName("owner_id");
        builder.Property(a => a.TenantId).HasColumnName("tenant_id");
        builder.Property(a => a.Title).HasMaxLength(256);
        builder.Property(a => a.Description).HasMaxLength(2000);

        builder.HasIndex(a => a.FolderId);
        builder.HasIndex(a => a.OwnerId);
        builder.HasIndex(a => a.TenantId);
        builder.HasIndex(a => a.Status);
    }
}
