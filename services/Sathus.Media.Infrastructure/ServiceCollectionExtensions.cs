using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Infrastructure.Persistence;
using Sathus.Media.Infrastructure.Repositories;
using Sathus.Media.Infrastructure.Search;
using Sathus.Media.Infrastructure.Services;

namespace Sathus.Media.Infrastructure;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers the media infrastructure (DbContext, repositories, search, audit).
    /// </summary>
    public static IServiceCollection AddMediaInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<MediaDbContext>(options => options.UseNpgsql(connectionString));

        services.AddScoped<IMediaRepository, EfMediaRepository>();
        services.AddScoped<IMediaFolderRepository, EfMediaFolderRepository>();
        services.AddScoped<IMediaCollectionRepository, EfMediaCollectionRepository>();
        services.AddScoped<IMediaUsageRepository, EfMediaUsageRepository>();
        services.AddScoped<IMediaSearchProvider, PostgreSqlMediaSearchProvider>();
        services.AddScoped<IMediaAuditService, EfMediaAuditService>();

        return services;
    }
}
