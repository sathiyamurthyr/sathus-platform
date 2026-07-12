using Microsoft.EntityFrameworkCore;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Persistence.Configurations;

namespace Sathus.Upload.Infrastructure.Persistence;

public class UploadDbContext : DbContext
{
    public UploadDbContext(DbContextOptions<UploadDbContext> options) : base(options)
    {
    }

    public DbSet<UploadSession> UploadSessions => Set<UploadSession>();
    public DbSet<UploadChunk> UploadChunks => Set<UploadChunk>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(UploadDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<UploadSession>())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Property(nameof(UploadSession.StartedAt)).CurrentValue is DateTime started && started == default)
                {
                    entry.Property(nameof(UploadSession.StartedAt)).CurrentValue = DateTime.UtcNow;
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Property(nameof(UploadSession.UpdatedAt)).CurrentValue = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
