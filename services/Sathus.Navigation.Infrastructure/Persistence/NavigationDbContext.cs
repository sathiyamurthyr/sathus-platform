using Microsoft.EntityFrameworkCore;

namespace Sathus.Navigation.Infrastructure.Persistence;

public class NavigationDbContext : DbContext
{
    public NavigationDbContext(DbContextOptions<NavigationDbContext> options) : base(options)
    {
    }

    public DbSet<NavigationTree> NavigationTrees => Set<NavigationTree>();
    public DbSet<NavigationMenu> NavigationMenus => Set<NavigationMenu>();
    public DbSet<NavigationNode> NavigationNodes => Set<NavigationNode>();
    public DbSet<NavigationItem> NavigationItems => Set<NavigationItem>();
    public DbSet<NavigationVersion> NavigationVersions => Set<NavigationVersion>();
    public DbSet<NavigationRoute> NavigationRoutes => Set<NavigationRoute>();
    public DbSet<NavigationRedirect> NavigationRedirects => Set<NavigationRedirect>();
    public DbSet<NavigationHistory> NavigationHistory => Set<NavigationHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(NavigationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
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
