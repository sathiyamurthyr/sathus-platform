namespace Sathus.Content.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Content.Domain.Entities;

public class MediaAssetConfiguration : IEntityTypeConfiguration<MediaAsset>
{
    public void Configure(EntityTypeBuilder<MediaAsset> builder)
    {
        builder.ToTable("media_assets");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Filename)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(m => m.OriginalName)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(m => m.MimeType)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(m => m.Size)
            .IsRequired();

        builder.Property(m => m.Url)
            .IsRequired()
            .HasMaxLength(2048);

        builder.Property(m => m.AltText)
            .HasMaxLength(512);

        builder.HasIndex(m => m.Filename);
    }
}
