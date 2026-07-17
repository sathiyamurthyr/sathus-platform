namespace Sathus.Content.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Domain.Interfaces;

public class ContentDbContext(DbContextOptions<ContentDbContext> options) : DbContext(options)
{
    public DbSet<ContentItem> ContentItems => Set<ContentItem>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<ContentItemCategory> ContentItemCategories => Set<ContentItemCategory>();
    public DbSet<ContentItemTag> ContentItemTags => Set<ContentItemTag>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ContentDbContext).Assembly);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType).HasKey(nameof(BaseEntity.Id));
            }
        }

        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                var createdAt = entry.Metadata.FindProperty("CreatedAt");
                if (createdAt != null && createdAt.ClrType == typeof(DateTime) && entry.Property("CreatedAt").CurrentValue is DateTime dt && dt == default)
                {
                    entry.Property("CreatedAt").CurrentValue = DateTime.UtcNow;
                }
            }

            if (entry.State == EntityState.Modified)
            {
                var updatedAt = entry.Metadata.FindProperty("UpdatedAt");
                if (updatedAt != null && updatedAt.ClrType == typeof(DateTime))
                {
                    entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
                }
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
