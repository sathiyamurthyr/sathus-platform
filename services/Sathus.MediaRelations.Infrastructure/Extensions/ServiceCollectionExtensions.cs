using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sathus.Media.Infrastructure.Persistence;
using Sathus.MediaRelations.Application.Behaviors;
using Sathus.MediaRelations.Application.Commands.CreateReference;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Application.Validators;
using Sathus.MediaRelations.Infrastructure.Configuration;
using Sathus.MediaRelations.Infrastructure.HostedServices;
using Sathus.MediaRelations.Infrastructure.Observability;
using Sathus.MediaRelations.Infrastructure.Persistence;
using Sathus.MediaRelations.Infrastructure.Repositories;
using Sathus.MediaRelations.Infrastructure.Services;

namespace Sathus.MediaRelations.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMediaRelationsInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=sathus_media;Username=postgres;Password=postgres";

        services.AddDbContext<MediaRelationsDbContext>(options => options.UseNpgsql(connectionString));

        // DAM Foundation context used for asset existence checks.
        services.AddDbContext<MediaDbContext>(options => options.UseNpgsql(connectionString));

        services.AddScoped<IMediaReferenceRepository, EfMediaReferenceRepository>();
        services.AddScoped<IMediaUsageRepository, EfMediaUsageRepository>();
        services.AddScoped<IMediaRelationRepository, EfMediaRelationRepository>();
        services.AddScoped<IMediaDependencyRepository, EfMediaDependencyRepository>();
        services.AddScoped<IMediaReferenceHistoryRepository, EfMediaReferenceHistoryRepository>();
        services.AddScoped<IMediaUsageStatisticsRepository, EfMediaUsageStatisticsRepository>();
        services.AddScoped<IMediaReferenceSnapshotRepository, EfMediaReferenceSnapshotRepository>();
        services.AddScoped<IMediaRelationshipGraphRepository, EfMediaRelationshipGraphRepository>();

        services.AddScoped<IAssetExistenceChecker, MediaAssetExistenceChecker>();
        services.AddScoped<IUsageGraphBuilder, UsageGraphBuilder>();
        services.AddScoped<ISafeDeletePolicy, SafeDeletePolicy>();
        services.AddScoped<IReferenceScanner, ReferenceScanner>();
        services.AddSingleton<IClock, SystemClock>();

        services.AddMemoryCache(options => options.SizeLimit = 100_000);
        services.AddSingleton<IUsageGraphCache, InMemoryUsageGraphCache>();
        services.AddSingleton<MediaRelationsMetrics>();

        services.Configure<ReferenceScannerOptions>(configuration.GetSection(ReferenceScannerOptions.SectionName));
        services.AddHostedService<ReferenceScannerBackgroundService>();

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(CreateReferenceCommand).Assembly);
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssemblyContaining<CreateReferenceCommandValidator>();

        return services;
    }
}
