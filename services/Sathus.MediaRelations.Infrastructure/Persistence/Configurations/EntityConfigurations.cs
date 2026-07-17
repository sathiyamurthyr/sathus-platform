using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Infrastructure.Persistence.Configurations;

public sealed class MediaUsageConfiguration : IEntityTypeConfiguration<MediaUsage>
{
    public void Configure(EntityTypeBuilder<MediaUsage> builder)
    {
        builder.ToTable("media_usages");
        builder.HasKey(u => u.Id);

        builder.Property(u => u.AssetId).IsRequired();
        builder.Property(u => u.Module).HasMaxLength(128).IsRequired();
        builder.Property(u => u.ActiveReferenceCount).IsRequired();
        builder.Property(u => u.UsageTypes).HasMaxLength(1024);
        builder.Property(u => u.TenantId);
        builder.Property(u => u.FirstReferencedAt).IsRequired();
        builder.Property(u => u.LastReferencedAt).IsRequired();

        builder.OwnsOne(u => u.ReferenceType, v =>
            v.Property(p => p.Value).HasColumnName("reference_type").HasMaxLength(ReferenceType.MaxLength).IsRequired());
        builder.OwnsOne(u => u.SourceReferenceId, v =>
            v.Property(p => p.Value).HasColumnName("source_reference_id").HasMaxLength(ReferenceId.MaxLength).IsRequired());

        builder.HasIndex(u => u.AssetId);
        builder.HasIndex(u => u.TenantId);

        builder.Ignore(u => u.DomainEvents);
    }
}

public sealed class MediaRelationConfiguration : IEntityTypeConfiguration<MediaRelation>
{
    public void Configure(EntityTypeBuilder<MediaRelation> builder)
    {
        builder.ToTable("media_relation_edges");
        builder.HasKey(r => r.Id);

        builder.Property(r => r.SourceNodeKey).HasMaxLength(512).IsRequired();
        builder.Property(r => r.TargetNodeKey).HasMaxLength(512).IsRequired();
        builder.Property(r => r.SourceNodeType).HasConversion<int>().IsRequired();
        builder.Property(r => r.TargetNodeType).HasConversion<int>().IsRequired();
        builder.Property(r => r.Relationship).HasMaxLength(128).IsRequired();
        builder.Property(r => r.TenantId);

        builder.HasIndex(r => r.SourceNodeKey);
        builder.HasIndex(r => r.TargetNodeKey);
        builder.HasIndex(r => new { r.SourceNodeKey, r.TargetNodeKey, r.Relationship });

        builder.Ignore(r => r.DomainEvents);
    }
}

public sealed class MediaDependencyConfiguration : IEntityTypeConfiguration<MediaDependency>
{
    public void Configure(EntityTypeBuilder<MediaDependency> builder)
    {
        builder.ToTable("media_dependencies");
        builder.HasKey(d => d.Id);

        builder.Property(d => d.AssetId).IsRequired();
        builder.Property(d => d.DependentNodeKey).HasMaxLength(512).IsRequired();
        builder.Property(d => d.DependentNodeType).HasConversion<int>().IsRequired();
        builder.Property(d => d.Path).HasMaxLength(4096);
        builder.Property(d => d.IsCircular).IsRequired();
        builder.Property(d => d.TenantId);

        builder.OwnsOne(d => d.Level, v =>
            v.Property(p => p.Value).HasColumnName("level").IsRequired());

        builder.HasIndex(d => d.AssetId);

        builder.Ignore(d => d.DomainEvents);
    }
}

public sealed class MediaReferenceHistoryConfiguration : IEntityTypeConfiguration<MediaReferenceHistory>
{
    public void Configure(EntityTypeBuilder<MediaReferenceHistory> builder)
    {
        builder.ToTable("media_reference_history");
        builder.HasKey(h => h.Id);

        builder.Property(h => h.ReferenceId).IsRequired();
        builder.Property(h => h.AssetId).IsRequired();
        builder.Property(h => h.Action).HasConversion<int>().IsRequired();
        builder.Property(h => h.Version).IsRequired();
        builder.Property(h => h.StatusAfter).HasConversion<int>().IsRequired();
        builder.Property(h => h.Detail).HasMaxLength(2048);
        builder.Property(h => h.ActorId);
        builder.Property(h => h.OccurredAt).IsRequired();

        builder.HasIndex(h => h.ReferenceId);
        builder.HasIndex(h => h.AssetId);

        builder.Ignore(h => h.DomainEvents);
    }
}

public sealed class MediaUsageStatisticsConfiguration : IEntityTypeConfiguration<MediaUsageStatistics>
{
    public void Configure(EntityTypeBuilder<MediaUsageStatistics> builder)
    {
        builder.ToTable("media_usage_statistics");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.AssetId).IsRequired();
        builder.Property(s => s.UsageCount).IsRequired();
        builder.Property(s => s.DownloadCount).IsRequired();
        builder.Property(s => s.ViewCount).IsRequired();
        builder.Property(s => s.ReferenceCount).IsRequired();
        builder.Property(s => s.LastUsedAt);
        builder.Property(s => s.UnusedSince);
        builder.Property(s => s.TenantId);

        builder.HasIndex(s => s.AssetId).IsUnique();
        builder.HasIndex(s => s.ReferenceCount);

        builder.Ignore(s => s.DomainEvents);
    }
}

public sealed class MediaReferenceSnapshotConfiguration : IEntityTypeConfiguration<MediaReferenceSnapshot>
{
    public void Configure(EntityTypeBuilder<MediaReferenceSnapshot> builder)
    {
        builder.ToTable("media_reference_snapshots");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.AssetId).IsRequired();
        builder.Property(s => s.ReferenceCount).IsRequired();
        builder.Property(s => s.Payload).IsRequired();
        builder.Property(s => s.ContentHash).HasMaxLength(128).IsRequired();
        builder.Property(s => s.Reason).HasMaxLength(512);
        builder.Property(s => s.TenantId);
        builder.Property(s => s.CapturedAt).IsRequired();

        builder.HasIndex(s => s.AssetId);

        builder.Ignore(s => s.DomainEvents);
    }
}

public sealed class MediaRelationshipGraphConfiguration : IEntityTypeConfiguration<MediaRelationshipGraph>
{
    public void Configure(EntityTypeBuilder<MediaRelationshipGraph> builder)
    {
        builder.ToTable("media_relationship_graphs");
        builder.HasKey(g => g.Id);

        builder.Property(g => g.RootAssetId).IsRequired();
        builder.Property(g => g.GeneratedAt).IsRequired();
        builder.Property(g => g.MaxDepth).IsRequired();
        builder.Property(g => g.HasCycle).IsRequired();
        builder.Property(g => g.TenantId);

        builder.HasIndex(g => g.RootAssetId).IsUnique();

        builder.OwnsMany(g => g.Nodes, n =>
        {
            n.ToTable("media_graph_nodes");
            n.WithOwner().HasForeignKey(x => x.GraphId);
            n.HasKey(x => x.Id);
            n.Property(x => x.NodeKey).HasMaxLength(512).IsRequired();
            n.Property(x => x.NodeType).HasConversion<int>().IsRequired();
            n.Property(x => x.Label).HasMaxLength(512);
            n.Property(x => x.Depth).IsRequired();
        });

        builder.OwnsMany(g => g.Edges, e =>
        {
            e.ToTable("media_graph_edges");
            e.WithOwner().HasForeignKey(x => x.GraphId);
            e.HasKey(x => x.Id);
            e.Property(x => x.SourceNodeKey).HasMaxLength(512).IsRequired();
            e.Property(x => x.TargetNodeKey).HasMaxLength(512).IsRequired();
            e.Property(x => x.Relationship).HasMaxLength(128).IsRequired();
        });

        builder.Ignore(g => g.DomainEvents);
    }
}
