using System.Text;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using Sathus.Media.Domain;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Upload.Api.HealthChecks;
using Sathus.Upload.Api.Middleware;
using Sathus.Upload.Application.Behaviors;
using Sathus.Upload.Application.Commands.StartUpload;
using Sathus.Upload.Application.Validators;
using Sathus.Upload.Infrastructure;
using Sathus.Upload.Infrastructure.Extensions;
using Sathus.Upload.Infrastructure.Persistence;

namespace Sathus.Upload.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddUploadApi(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddControllers()
            .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNameCaseInsensitive = true);

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "Sathus Upload API", Version = "v1" });
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Enter 'Bearer' followed by your JWT token."
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                [new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }]
                    = new List<string>()
            });
        });

        services.AddUploadInfrastructure(configuration);

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(StartUploadCommand).Assembly);
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssemblyContaining<StartUploadCommandValidator>();

        services.AddProblemDetails(options =>
        {
            options.CustomizeProblemDetails = ctx =>
            {
                ctx.ProblemDetails.Instance = ctx.HttpContext.Request.Path;
                if (ctx.ProblemDetails.Extensions.TryGetValue("correlationId", out var existing) ||
                    existing is null or string)
                {
                    ctx.ProblemDetails.Extensions["correlationId"] = ctx.HttpContext.TraceIdentifier;
                }
            };
        });

        ConfigureAuthentication(services, configuration);
        ConfigureAuthorization(services);
        ConfigureObservability(services, configuration);

        services.AddHealthChecks()
            .AddCheck<UploadDbContextHealthCheck>("upload-database");

        return services;
    }

    private static void ConfigureAuthentication(IServiceCollection services, IConfiguration configuration)
    {
        var secret = configuration["Jwt:Secret"] ?? "upload-development-secret-key-please-change";
        var issuer = configuration["Jwt:Issuer"];
        var audience = configuration["Jwt:Audience"];

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = !string.IsNullOrWhiteSpace(issuer),
                    ValidateAudience = !string.IsNullOrWhiteSpace(audience),
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
                };

                options.Events = new JwtBearerEvents
                {
                    OnChallenge = context =>
                    {
                        context.HandleResponse();
                        return Task.CompletedTask;
                    }
                };
            });
    }

    private static void ConfigureAuthorization(IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            foreach (var permission in UploadPermissions.All)
            {
                options.AddPolicy(permission, policy => policy.RequireClaim("permission", permission));
            }
        });
    }

    private static void ConfigureObservability(IServiceCollection services, IConfiguration configuration)
    {
        var otel = configuration.GetSection("OpenTelemetry");
        if (!otel.GetValue("Enabled", true))
        {
            return;
        }

        services.AddOpenTelemetry()
            .WithTracing(tracing => tracing
                .AddSource("Sathus.Upload")
                .AddAspNetCoreInstrumentation()
                .AddConsoleExporter())
            .WithMetrics(metrics => metrics
                .AddAspNetCoreInstrumentation()
                .AddConsoleExporter());
    }
}
