using Microsoft.EntityFrameworkCore;

namespace Sathus.Search.Infrastructure.Persistence;

public sealed class SearchDbContext : DbContext
{
    public SearchDbContext(DbContextOptions<SearchDbContext> options) : base(options)
    {
    }

    public DbSet<SearchIndex> SearchIndexes => Set<SearchIndex>();
    public DbSet<SearchDocument> SearchDocuments => Set<SearchDocument>();
    public DbSet<SearchField> SearchFields => Set<SearchField>();
    public DbSet<SearchFacet> SearchFacets => Set<SearchFacet>();
    public DbSet<SearchSynonym> SearchSynonyms => Set<SearchSynonym>();
    public DbSet<SearchRanking> SearchRankings => Set<SearchRanking>();
    public DbSet<SearchSuggestion> SearchSuggestions => Set<SearchSuggestion>();
    public DbSet<SearchHighlight> SearchHighlights => Set<SearchHighlight>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SearchDbContext).Assembly);
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
