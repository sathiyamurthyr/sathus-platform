using Microsoft.EntityFrameworkCore;
using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Infrastructure.Persistence;

/// <summary>
/// EF Core context for the Asset Relationship &amp; Usage Engine. Stamps audit timestamps on
/// save and applies all configurations in this assembly.
/// </summary>
public class MediaRelationsDbContext : DbContext
{
    public MediaRelationsDbContext(DbContextOptions<MediaRelationsDbContext> options) : base(options)
    {
    }

    public DbSet<MediaReference> MediaReferences => Set<MediaReference>();
    public DbSet<MediaUsage> MediaUsages => Set<MediaUsage>();
    public DbSet<MediaRelation> MediaRelations => Set<MediaRelation>();
    public DbSet<MediaDependency> MediaDependencies => Set<MediaDependency>();
    public DbSet<MediaReferenceHistory> MediaReferenceHistory => Set<MediaReferenceHistory>();
    public DbSet<MediaUsageStatistics> MediaUsageStatistics => Set<MediaUsageStatistics>();
    public DbSet<MediaRelationshipGraph> MediaRelationshipGraphs => Set<MediaRelationshipGraph>();
    public DbSet<MediaReferenceSnapshot> MediaReferenceSnapshots => Set<MediaReferenceSnapshot>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MediaRelationsDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<Sathus.SharedKernel.Entities.Entity>())
        {
            if (entry.State == EntityState.Added && entry.Entity.CreatedAt == default)
            {
                entry.Entity.SetCreationAudit(entry.Entity.CreatedBy, now);
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.SetUpdateAudit(entry.Entity.UpdatedBy, now);
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
