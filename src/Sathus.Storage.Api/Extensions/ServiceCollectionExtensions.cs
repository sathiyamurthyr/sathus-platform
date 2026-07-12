using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Sathus.Storage.Api.Controllers;
using Sathus.Storage.Api.Filters;
using Sathus.Storage.Domain;
using Sathus.Storage.Infrastructure.Extensions;
using Sathus.Storage.Infrastructure.Security;

namespace Sathus.Storage.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddStorageServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddControllers(options => options.Filters.AddService<CorrelationIdFilter>())
            .AddJsonOptions(options =>
                options.JsonSerializerOptions.PropertyNameCaseInsensitive = true);

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "Sathus Storage API", Version = "v1" });
            options.DocInclusionPredicate((_, _) => true);
        });

        services.AddStorage(configuration);
        services.AddStorageProviders(configuration);
        services.AddStorageHealthChecks();

        services.AddSingleton<StoragePathValidator>();

        services.AddHttpClient();

        return services;
    }
}
