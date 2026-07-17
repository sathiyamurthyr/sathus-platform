using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Sathus.Navigation.Infrastructure.Persistence;

namespace Sathus.Navigation.Infrastructure;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<NavigationDbContext>
{
    public NavigationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<NavigationDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=sathus_navigation;Username=postgres;Password=postgres");

        return new NavigationDbContext(optionsBuilder.Options);
    }
}
