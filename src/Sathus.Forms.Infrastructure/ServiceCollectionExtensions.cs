using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Sathus.Forms.Domain;

namespace Sathus.Forms.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddForms(this IServiceCollection services, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        var section = configuration.GetSection("Forms");
        services.Configure<FormsOptions>(options =>
        {
            options.DefaultLocale = section["DefaultLocale"];
            options.EnableWorkflows = bool.TryParse(section["EnableWorkflows"], out var ew) ? ew : options.EnableWorkflows;
            options.EnableVersioning = bool.TryParse(section["EnableVersioning"], out var ev) ? ev : options.EnableVersioning;
        });

        return services;
    }
}
