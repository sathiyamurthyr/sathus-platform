using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Sathus.Navigation.Infrastructure.Persistence;

namespace Sathus.Navigation.Tests.Infrastructure;

public static class InMemoryNavigationContextFactory
{
    public static NavigationDbContext Create()
    {
        var services = new ServiceCollection();
        services.AddDbContext<NavigationDbContext>(options => options.UseInMemoryDatabase(Guid.NewGuid().ToString()));

        var provider = services.BuildServiceProvider();
        return provider.GetRequiredService<NavigationDbContext>();
    }
}
