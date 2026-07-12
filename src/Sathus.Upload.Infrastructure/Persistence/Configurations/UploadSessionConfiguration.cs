using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.ValueObjects;

namespace Sathus.Upload.Infrastructure.Persistence.Configurations;

public class UploadSessionConfiguration : IEntityTypeConfiguration<UploadSession>
{
    public void Configure(EntityTypeBuilder<UploadSession> builder)
    {
        builder.ToTable("upload_sessions");

        builder.HasKey(s => s.Id);
        builder.HasIndex(s => s.SessionId).IsUnique();
        builder.HasIndex(s => s.Status);
        builder.HasIndex(s => s.CreatedBy);
        builder.HasIndex(s => s.TenantId);
        builder.HasIndex(s => s.FolderId);
        builder.HasIndex(s => s.ParentSessionId);

        builder.OwnsOne(s => s.FileName, v => v.Property(p => p.Value).HasColumnName("file_name").HasMaxLength(FileName.MaxLength).IsRequired());
        builder.OwnsOne(s => s.FileExtension, v => v.Property(p => p.Value).HasColumnName("file_extension").HasMaxLength(FileExtension.MaxLength).IsRequired());
        builder.OwnsOne(s => s.MimeType, v => v.Property(p => p.Value).HasColumnName("mime_type").HasMaxLength(MimeType.MaxLength).IsRequired());
        builder.OwnsOne(s => s.FileSize, v => v.Property(p => p.Bytes).HasColumnName("size_bytes").IsRequired());
        builder.OwnsOne(s => s.StorageKey, v => v.Property(p => p.Value).HasColumnName("storage_key").HasMaxLength(Media.Domain.ValueObjects.StorageKey.MaxLength));
        builder.OwnsOne(s => s.Checksum, v => v.Property(p => p.Value).HasColumnName("checksum").HasMaxLength(Media.Domain.ValueObjects.Checksum.MaxLength));

        builder.Property(s => s.SessionId).HasMaxLength(UploadId.MaxLength).IsRequired();
        builder.Property(s => s.ChunkSize).IsRequired();
        builder.Property(s => s.TotalChunks).IsRequired();
        builder.Property(s => s.UploadedChunks).IsRequired();
        builder.Property(s => s.Progress).HasPrecision(5, 2);
        builder.Property(s => s.Status).HasConversion<int>().IsRequired();
        builder.Property(s => s.ErrorMessage).HasMaxLength(2000);
        builder.Property(s => s.StartedAt).IsRequired();
        builder.Property(s => s.CompletedAt);
        builder.Property(s => s.CreatedBy);
        builder.Property(s => s.TenantId);
        builder.Property(s => s.FolderId);
        builder.Property(s => s.ParentSessionId);
        builder.Property(s => s.IsFolder).IsRequired();
        builder.Property(s => s.FolderPath).HasMaxLength(2048);

        builder.Property(s => s.Metadata)
            .HasConversion(
                v => SerializeMetadata(v),
                v => DeserializeMetadata(v))
            .HasColumnName("metadata");

        builder.HasMany(s => s.Chunks)
            .WithOne(c => c.Session)
            .HasForeignKey(c => c.SessionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(s => s.ChildSessions)
            .WithOne()
            .HasForeignKey(c => c.ParentSessionId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static string SerializeMetadata(Dictionary<string, string>? metadata)
    {
        if (metadata == null || metadata.Count == 0)
            return string.Empty;

        return string.Join(';', metadata.Select(kv => $"{kv.Key}={kv.Value}"));
    }

    private static Dictionary<string, string> DeserializeMetadata(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return new Dictionary<string, string>();

        var result = new Dictionary<string, string>();
        foreach (var part in value.Split(';'))
        {
            var kv = part.Split('=', 2);
            if (kv.Length == 2)
                result[kv[0]] = kv[1];
        }

        return result;
    }
}
