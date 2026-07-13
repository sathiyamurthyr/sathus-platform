using Microsoft.EntityFrameworkCore;
using Sathus.Processing.Domain.Entities;
using Sathus.Processing.Infrastructure.Persistence.Configurations;

namespace Sathus.Processing.Infrastructure.Persistence;

public class ProcessingDbContext : DbContext
{
    public ProcessingDbContext(DbContextOptions<ProcessingDbContext> options) : base(options)
    {
    }

    public DbSet<AssetProcessingJob> ProcessingJobs => Set<AssetProcessingJob>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProcessingDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<AssetProcessingJob>())
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Property(nameof(AssetProcessingJob.UpdatedAt)).CurrentValue = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
