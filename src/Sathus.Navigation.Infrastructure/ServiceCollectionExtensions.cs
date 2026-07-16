using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Infrastructure.Adapters;
using Sathus.Navigation.Infrastructure.Engine;
using Sathus.Navigation.Infrastructure.Persistence;
using Sathus.Navigation.Infrastructure.Repositories;

namespace Sathus.Navigation.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddNavigationInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<NavigationDbContext>(options => options.UseNpgsql(connectionString));

        services.AddScoped<INavigationTreeRepository, EfNavigationTreeRepository>();
        services.AddScoped<INavigationMenuRepository, EfNavigationMenuRepository>();
        services.AddScoped<IVisibilityEvaluator, DefaultVisibilityEvaluator>();
        services.AddScoped<INodePermissionEvaluator, DefaultNodePermissionEvaluator>();

        services.AddHttpClient<IReferenceValidator, ContentEngineReferenceValidator>();
        services.AddHttpClient<IPermissionCatalog, PermissionEngineAdapter>();

        return services;
    }
}
