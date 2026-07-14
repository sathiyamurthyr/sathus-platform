using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sathus.Search.Application.Interfaces;
using Sathus.Search.Infrastructure.HostedServices;
using Sathus.Search.Infrastructure.Persistence;
using Sathus.Search.Infrastructure.Repositories;
using Sathus.Search.Infrastructure.Services;
using Sathus.Search.Infrastructure.Services.ContentSourceProviders;

namespace Sathus.Search.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSearchInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<SearchDbContext>(options => options.UseNpgsql(connectionString));

        services.AddScoped<ISearchRepository, EfSearchRepository>();
        services.AddScoped<ISearchProvider, PostgreSqlSearchProvider>();
        services.AddScoped<ISearchIndexer, SearchIndexer>();
        services.AddScoped<ISearchRanker, SearchRanker>();
        services.AddScoped<ISearchSynonymProvider, SearchSynonymProvider>();
        services.AddScoped<ISearchPermissionProvider, SearchPermissionProvider>();

        services.AddSingleton<IContentSourceProvider, PagesContentSourceProvider>();
        services.AddSingleton<IContentSourceProvider, NavigationContentSourceProvider>();
        services.AddSingleton<IContentSourceProvider, ProductContentSourceProvider>();
        services.AddSingleton<IContentSourceProvider, DocumentationContentSourceProvider>();
        services.AddSingleton<IContentSourceProvider, BlogContentSourceProvider>();
        services.AddSingleton<IContentSourceProvider, MediaContentSourceProvider>();
        services.AddSingleton<IContentSourceProvider, FormContentSourceProvider>();
        services.AddSingleton<IContentSourceProvider, UserContentSourceProvider>();
        services.AddSingleton<IContentSourceProvider, KnowledgeBaseContentSourceProvider>();

        services.AddMemoryCache();
        services.AddHttpClient();
        services.AddHostedService<SearchBackgroundIndexingService>();

        return services;
    }
}
