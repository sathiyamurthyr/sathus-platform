using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sathus.Processing.Application.Behaviors;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Application.Validators;
using Sathus.Processing.Domain;
using Sathus.Processing.Infrastructure.HostedServices;
using Sathus.Processing.Infrastructure.Media;
using Sathus.Processing.Infrastructure.Persistence;
using Sathus.Processing.Infrastructure.Processors;
using Sathus.Processing.Infrastructure.Queue;
using Sathus.Processing.Infrastructure.Repositories;
using Sathus.Processing.Infrastructure.Services;
using Sathus.Upload.Application.Interfaces;

namespace Sathus.Processing.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddProcessingInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=sathus_media;Username=postgres;Password=postgres";

        services.AddDbContext<ProcessingDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IProcessingJobRepository, EfProcessingJobRepository>();
        services.AddSingleton<IProcessingJobQueue, ProcessingJobQueue>();

        services.AddScoped<IAssetSourceProvider, StorageAssetSourceProvider>();
        services.AddScoped<IChecksumService, DefaultChecksumService>();
        services.AddScoped<IDuplicateDetector, DefaultDuplicateDetector>();
        services.AddScoped<Sathus.Processing.Application.Interfaces.IVirusScanService, NoOpVirusScanService>();
        services.AddScoped<Sathus.Processing.Application.Interfaces.IMetadataExtractionService, DefaultMetadataExtractionService>();
        services.AddScoped<IAssetRenditionStorage, StorageRenditionStorage>();
        services.AddScoped<IMediaTool, FfmpegMediaTool>();

        services.AddScoped<IAssetProcessor, ImageProcessor>();
        services.AddScoped<IAssetProcessor, VideoProcessor>();
        services.AddScoped<IAssetProcessor, AudioProcessor>();
        services.AddScoped<IAssetProcessor, DocumentProcessor>();
        services.AddScoped<IAssetProcessor, ArchiveProcessor>();
        services.AddScoped<IAssetProcessor, UnknownProcessor>();
        services.AddScoped<IProcessorRegistry, ProcessorRegistry>();

        services.AddScoped<IAssetProcessingPipeline, AssetProcessingPipeline>();

        services.AddHostedService<ProcessingBackgroundService>();

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(EnqueueAssetProcessingCommand).Assembly);
            config.RegisterServicesFromAssembly(typeof(ServiceCollectionExtensions).Assembly);
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssemblyContaining<EnqueueAssetProcessingCommandValidator>();

        return services;
    }
}
