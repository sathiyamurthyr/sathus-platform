using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Sathus.Content.Infrastructure.Persistence;

namespace Sathus.Content.Infrastructure;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ContentDbContext>
{
    public ContentDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ContentDbContext>();
        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5432;Database=sathus_content;Username=postgres;Password=postgres");
        return new ContentDbContext(optionsBuilder.Options);
    }
}
