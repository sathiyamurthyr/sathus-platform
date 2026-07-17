using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Sathus.Media.Infrastructure.Persistence;

namespace Sathus.Media.Infrastructure;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<MediaDbContext>
{
    public MediaDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<MediaDbContext>();
        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5432;Database=sathus_media;Username=postgres;Password=postgres");
        return new MediaDbContext(optionsBuilder.Options);
    }
}
