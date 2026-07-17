using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Sathus.Identity.Infrastructure.Persistence;

namespace Sathus.Identity.Infrastructure;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<IdentityDbContext>
{
    public IdentityDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<IdentityDbContext>();
        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5432;Database=sathus_identity;Username=postgres;Password=postgres");
        return new IdentityDbContext(optionsBuilder.Options);
    }
}
