using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Sathus.Processing.Domain.Entities;
using Sathus.Processing.Domain.ValueObjects;

namespace Sathus.Processing.Infrastructure.Persistence.Configurations;

public class AssetProcessingJobConfiguration : IEntityTypeConfiguration<AssetProcessingJob>
{
    public void Configure(EntityTypeBuilder<AssetProcessingJob> builder)
    {
        builder.ToTable("processing_jobs");

        builder.HasKey(j => j.Id);

        builder.HasIndex(j => j.AssetId);
        builder.HasIndex(j => j.Status);
        builder.HasIndex(j => j.MediaTypeValue);
        builder.HasIndex(j => j.CreatedAt);

        builder.Property(j => j.AssetId).IsRequired();
        builder.Property(j => j.StorageKey).HasMaxLength(2048).IsRequired();
        builder.Property(j => j.FileName).HasMaxLength(512).IsRequired();
        builder.Property(j => j.MimeType).HasMaxLength(128).IsRequired();
        builder.Property(j => j.MediaTypeValue).HasMaxLength(64).IsRequired();
        builder.Property(j => j.FileSize).IsRequired();
        builder.Property(j => j.Status).HasConversion<int>().IsRequired();
        builder.Property(j => j.CurrentStep).HasConversion<int>().IsRequired();
        builder.Property(j => j.RetryCount).IsRequired();
        builder.Property(j => j.MaxRetries).IsRequired();
        builder.Property(j => j.ErrorMessage).HasColumnType("text");
        builder.Property(j => j.Checksum).HasMaxLength(256);
        builder.Property(j => j.DuplicateOfAssetId);
        builder.Property(j => j.StartedAt);
        builder.Property(j => j.CompletedAt);
        builder.Property(j => j.LastAttemptAt);
        builder.Property(j => j.CreatedBy);
        builder.Property(j => j.TenantId);

        builder.Property(j => j.ExtractedMetadata)
            .HasConversion(
                new ValueConverter<Dictionary<string, string>, string>(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<Dictionary<string, string>>(v ?? "{}", (JsonSerializerOptions?)null) ?? new Dictionary<string, string>(),
                    null))
            .HasColumnName("extracted_metadata")
            .HasColumnType("text");

        builder.Property(j => j.Renditions)
            .HasConversion(
                new ValueConverter<List<Rendition>, string>(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<Rendition>>(v ?? "[]", (JsonSerializerOptions?)null) ?? new List<Rendition>(),
                    null))
            .HasColumnName("renditions")
            .HasColumnType("text");
    }
}
