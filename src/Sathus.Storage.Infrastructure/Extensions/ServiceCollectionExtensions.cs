using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Infrastructure.Configuration;
using Sathus.Storage.Infrastructure.Factory;
using Sathus.Storage.Infrastructure.Observability;
using Sathus.Storage.Infrastructure.Providers;
using Sathus.Storage.Infrastructure.Security;

namespace Sathus.Storage.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddStorage(this IServiceCollection services, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        services.Configure<StorageOptions>(configuration.GetSection("Storage"));

        services.AddSingleton<StoragePathValidator>();
        services.AddSingleton<StorageProviderRegistry>();
        services.AddSingleton<IStorageProviderFactory, StorageProviderFactory>();

        return services;
    }

    public static IServiceCollection AddStorageProvider<T>(this IServiceCollection services, IConfiguration configuration, string providerName) where T : class, IStorageProvider
    {
        ArgumentNullException.ThrowIfNull(configuration);

        services.AddSingleton<IStorageProvider>(sp =>
        {
            var registry = sp.GetRequiredService<StorageProviderRegistry>();
            var provider = Activator.CreateInstance(typeof(T), sp.GetRequiredService<IOptions<LocalStorageOptions>>(), sp.GetRequiredService<ILogger<T>>(), sp.GetRequiredService<StoragePathValidator>()) as IStorageProvider
                ?? throw new InvalidOperationException($"Failed to create provider {typeof(T).Name}");
            
            registry.RegisterProvider(provider);
            return provider;
        });

        return services;
    }

    public static IServiceCollection AddStorageProviders(this IServiceCollection services, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        services.AddSingleton<LocalStorageProvider>();
        services.AddSingleton<MinIoStorageProvider>();
        services.AddSingleton<AwsS3StorageProvider>();
        services.AddSingleton<BackblazeB2StorageProvider>();
        services.AddSingleton<AzureBlobStorageProvider>();
        services.AddSingleton<GoogleCloudStorageProvider>();

        services.AddSingleton<StorageProviderRegistry>(sp =>
        {
            var registry = new StorageProviderRegistry(sp.GetRequiredService<ILogger<StorageProviderRegistry>>());

            using var scope = sp.CreateScope();
            var scoped = scope.ServiceProvider;

            try
            {
                var local = scoped.GetRequiredService<LocalStorageProvider>();
                registry.RegisterProvider(local);
            }
            catch (Exception ex)
            {
                sp.GetRequiredService<ILogger<StorageProviderRegistry>>().LogWarning(ex, "Failed to register local storage provider.");
            }

            try
            {
                var minio = scoped.GetRequiredService<MinIoStorageProvider>();
                registry.RegisterProvider(minio);
            }
            catch (Exception ex)
            {
                sp.GetRequiredService<ILogger<StorageProviderRegistry>>().LogWarning(ex, "Failed to register MinIO storage provider.");
            }

            try
            {
                var s3 = scoped.GetRequiredService<AwsS3StorageProvider>();
                registry.RegisterProvider(s3);
            }
            catch (Exception ex)
            {
                sp.GetRequiredService<ILogger<StorageProviderRegistry>>().LogWarning(ex, "Failed to register S3 storage provider.");
            }

            try
            {
                var backblaze = scoped.GetRequiredService<BackblazeB2StorageProvider>();
                registry.RegisterProvider(backblaze);
            }
            catch (Exception ex)
            {
                sp.GetRequiredService<ILogger<StorageProviderRegistry>>().LogWarning(ex, "Failed to register Backblaze storage provider.");
            }

            try
            {
                var azure = scoped.GetRequiredService<AzureBlobStorageProvider>();
                registry.RegisterProvider(azure);
            }
            catch (Exception ex)
            {
                sp.GetRequiredService<ILogger<StorageProviderRegistry>>().LogWarning(ex, "Failed to register Azure Blob storage provider.");
            }

            try
            {
                var gcs = scoped.GetRequiredService<GoogleCloudStorageProvider>();
                registry.RegisterProvider(gcs);
            }
            catch (Exception ex)
            {
                sp.GetRequiredService<ILogger<StorageProviderRegistry>>().LogWarning(ex, "Failed to register Google Cloud Storage provider.");
            }

            var defaultProvider = configuration["Storage:DefaultProvider"] ?? "local";
            registry.SetDefaultProvider(defaultProvider);

            return registry;
        });

        return services;
    }

    public static IHealthChecksBuilder AddStorageHealthChecks(this IHealthChecksBuilder builder)
    {
        builder.AddCheck<StorageHealthCheck>("storage", tags: new[] { "storage", "ready" });
        return builder;
    }
}
