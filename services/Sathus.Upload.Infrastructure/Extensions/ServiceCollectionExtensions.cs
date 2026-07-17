using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Upload.Application.Behaviors;
using Sathus.Upload.Application.Commands.StartUpload;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Application.Validators;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Persistence;
using Sathus.Upload.Infrastructure.Repositories;
using Sathus.Upload.Infrastructure.Services;

namespace Sathus.Upload.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddUploadInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=sathus_media;Username=postgres;Password=postgres";

        services.AddDbContext<UploadDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IUploadRepository, EfUploadRepository>();
        services.AddScoped<IUploadValidator, DefaultUploadValidator>();
        services.AddScoped<IChunkEngine, DefaultChunkEngine>();
        services.AddScoped<IVirusScanService, NoOpVirusScanService>();
        services.AddScoped<IMetadataExtractionService, NoOpMetadataExtractionService>();

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(StartUploadCommand).Assembly);
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssemblyContaining<StartUploadCommandValidator>();

        return services;
    }
}
