using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Sathus.Media.Domain.Entities;
using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Infrastructure.Persistence;

public class MediaDbContext : DbContext
{
    public MediaDbContext(DbContextOptions<MediaDbContext> options) : base(options)
    {
    }

    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<MediaFolder> MediaFolders => Set<MediaFolder>();
    public DbSet<MediaCollection> MediaCollections => Set<MediaCollection>();
    public DbSet<MediaTag> MediaTags => Set<MediaTag>();
    public DbSet<MediaAssetTag> MediaAssetTags => Set<MediaAssetTag>();
    public DbSet<MediaCollectionAsset> MediaCollectionAssets => Set<MediaCollectionAsset>();
    public DbSet<MediaMetadata> MediaMetadata => Set<MediaMetadata>();
    public DbSet<MediaUsage> MediaUsages => Set<MediaUsage>();
    public DbSet<MediaVersion> MediaVersions => Set<MediaVersion>();
    public DbSet<MediaAudit> MediaAudits => Set<MediaAudit>();
    public DbSet<MediaPermission> MediaPermissions => Set<MediaPermission>();
    public DbSet<MediaRelation> MediaRelations => Set<MediaRelation>();
    public DbSet<MediaShare> MediaShares => Set<MediaShare>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MediaDbContext).Assembly);

        var isRelational = Database.IsRelational();

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (!typeof(Entity).IsAssignableFrom(entityType.ClrType) || entityType.ClrType == typeof(Entity))
            {
                continue;
            }

            var method = typeof(MediaDbContext)
                .GetMethod(nameof(ConfigureEntity), BindingFlags.NonPublic | BindingFlags.Static)!
                .MakeGenericMethod(entityType.ClrType);

            method.Invoke(null, new object[] { modelBuilder, isRelational });
        }

        base.OnModelCreating(modelBuilder);
    }

    private static void ConfigureEntity<TEntity>(ModelBuilder modelBuilder, bool isRelational) where TEntity : Entity
    {
        modelBuilder.Entity<TEntity>(builder =>
        {
            builder.HasQueryFilter(e => !e.IsDeleted);
            if (isRelational)
            {
                builder.Property(e => e.RowVersion).IsRowVersion().IsRequired();
            }
            builder.Property(e => e.CreatedAt).IsRequired();
            builder.Property(e => e.UpdatedAt).IsRequired();
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<Entity>())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Property(nameof(Entity.CreatedAt)).CurrentValue is DateTime created && created == default)
                {
                    entry.Property(nameof(Entity.CreatedAt)).CurrentValue = DateTime.UtcNow;
                }

                if (entry.Property(nameof(Entity.UpdatedAt)).CurrentValue is DateTime updated && updated == default)
                {
                    entry.Property(nameof(Entity.UpdatedAt)).CurrentValue = DateTime.UtcNow;
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Property(nameof(Entity.UpdatedAt)).CurrentValue = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
