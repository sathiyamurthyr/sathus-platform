using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Infrastructure.Persistence.Configurations;

public sealed class MediaReferenceConfiguration : IEntityTypeConfiguration<MediaReference>
{
    public void Configure(EntityTypeBuilder<MediaReference> builder)
    {
        builder.ToTable("media_references");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.AssetId).IsRequired();
        builder.Property(r => r.Module).HasMaxLength(128).IsRequired();
        builder.Property(r => r.Status).HasConversion<int>().IsRequired();
        builder.Property(r => r.BrokenReason).HasMaxLength(1024);
        builder.Property(r => r.Title).HasMaxLength(512);
        builder.Property(r => r.Url).HasMaxLength(2048);
        builder.Property(r => r.LastValidatedAt);
        builder.Property(r => r.ScheduledFor);
        builder.Property(r => r.TenantId);

        builder.OwnsOne(r => r.ReferenceType, v =>
            v.Property(p => p.Value).HasColumnName("reference_type").HasMaxLength(ReferenceType.MaxLength).IsRequired());
        builder.OwnsOne(r => r.SourceReferenceId, v =>
            v.Property(p => p.Value).HasColumnName("source_reference_id").HasMaxLength(ReferenceId.MaxLength).IsRequired());
        builder.OwnsOne(r => r.UsageType, v =>
            v.Property(p => p.Value).HasColumnName("usage_type").HasMaxLength(UsageType.MaxLength).IsRequired());
        builder.OwnsOne(r => r.Path, v =>
            v.Property(p => p.Value).HasColumnName("path").HasMaxLength(ReferencePath.MaxLength).IsRequired());
        builder.OwnsOne(r => r.Scope, v =>
            v.Property(p => p.Value).HasColumnName("scope").HasMaxLength(ReferenceScope.MaxLength).IsRequired());
        builder.OwnsOne(r => r.Version, v =>
            v.Property(p => p.Value).HasColumnName("version").IsRequired());

        builder.HasIndex(r => r.AssetId);
        builder.HasIndex(r => r.Status);
        builder.HasIndex(r => r.Module);
        builder.HasIndex(r => r.TenantId);
        builder.HasIndex(r => new { r.AssetId, r.Status });

        builder.Ignore(r => r.DomainEvents);
    }
}
