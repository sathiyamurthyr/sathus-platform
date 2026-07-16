using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Upload.Domain.Entities;

namespace Sathus.Upload.Infrastructure.Persistence.Configurations;

public class UploadChunkConfiguration : IEntityTypeConfiguration<UploadChunk>
{
    public void Configure(EntityTypeBuilder<UploadChunk> builder)
    {
        builder.ToTable("upload_chunks");

        builder.HasKey(c => c.Id);
        builder.HasIndex(c => new { c.SessionId, c.ChunkIndex }).IsUnique();
        builder.HasIndex(c => c.Status);

        builder.Property(c => c.ChunkIndex).IsRequired();
        builder.Property(c => c.Size).IsRequired();
        builder.Property(c => c.Offset).IsRequired();
        builder.Property(c => c.SessionId).IsRequired();
        builder.Property(c => c.Checksum).HasMaxLength(256);
        builder.Property(c => c.Status).HasConversion<int>().IsRequired();
        builder.Property(c => c.RetryCount).IsRequired();
        builder.Property(c => c.StartedAt);
        builder.Property(c => c.CompletedAt);
        builder.Property(c => c.StorageKey).HasMaxLength(2048);
    }
}
