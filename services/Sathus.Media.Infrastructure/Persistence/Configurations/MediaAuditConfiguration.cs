using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaAuditConfiguration : IEntityTypeConfiguration<MediaAudit>
{
    public void Configure(EntityTypeBuilder<MediaAudit> builder)
    {
        builder.ToTable("media_audit_logs");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.AssetId).HasColumnName("asset_id");
        builder.Property(a => a.Action).IsRequired().HasMaxLength(128);
        builder.Property(a => a.ActorId).HasColumnName("actor_id");
        builder.Property(a => a.Details).HasMaxLength(4000);
        builder.Property(a => a.IpAddress).HasMaxLength(64);
        builder.Property(a => a.CorrelationId).HasColumnName("correlation_id").HasMaxLength(64);

        builder.HasOne(a => a.Asset)
            .WithMany()
            .HasForeignKey(a => a.AssetId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(a => a.AssetId).HasDatabaseName("ix_media_audit_asset");
        builder.HasIndex(a => a.Action).HasDatabaseName("ix_media_audit_action");
        builder.HasIndex(a => a.CreatedAt).HasDatabaseName("ix_media_audit_created");
    }
}
