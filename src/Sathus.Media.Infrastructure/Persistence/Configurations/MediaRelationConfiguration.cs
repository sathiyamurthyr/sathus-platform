using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.Enums;

namespace Sathus.Media.Infrastructure.Persistence.Configurations;

public class MediaRelationConfiguration : IEntityTypeConfiguration<MediaRelation>
{
    public void Configure(EntityTypeBuilder<MediaRelation> builder)
    {
        builder.ToTable("media_relations");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.SourceAssetId).HasColumnName("source_asset_id");
        builder.Property(r => r.TargetAssetId).HasColumnName("target_asset_id");
        builder.Property(r => r.RelationType).HasConversion<int>().IsRequired();
        builder.Property(r => r.CreatedBy).HasColumnName("created_by");

        builder.HasOne(r => r.SourceAsset)
            .WithMany(a => a.Relations)
            .HasForeignKey(r => r.SourceAssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.TargetAsset)
            .WithMany()
            .HasForeignKey(r => r.TargetAssetId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(r => r.SourceAssetId).HasDatabaseName("ix_media_relations_source");
        builder.HasIndex(r => r.TargetAssetId).HasDatabaseName("ix_media_relations_target");
    }
}
