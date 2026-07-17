using System.Text;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using Sathus.MediaRelations.Api.HealthChecks;
using Sathus.MediaRelations.Application.Behaviors;
using Sathus.MediaRelations.Application.Commands.CreateReference;
using Sathus.MediaRelations.Application.Validators;
using Sathus.MediaRelations.Domain;
using Sathus.MediaRelations.Infrastructure.Extensions;
using Sathus.MediaRelations.Infrastructure.Observability;

namespace Sathus.MediaRelations.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMediaRelationsApi(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddControllers()
            .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNameCaseInsensitive = true);

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "Sathus Media Relations API", Version = "v1" });
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

        services.AddMediaRelationsInfrastructure(configuration);

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(CreateReferenceCommand).Assembly);
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssemblyContaining<CreateReferenceCommandValidator>();

        services.AddProblemDetails();

        ConfigureAuthentication(services, configuration);
        ConfigureAuthorization(services);
        ConfigureObservability(services, configuration);

        services.AddHealthChecks()
            .AddCheck<MediaRelationsDbContextHealthCheck>("media-relations-database");

        return services;
    }

    private static void ConfigureAuthentication(IServiceCollection services, IConfiguration configuration)
    {
        var secret = configuration["Jwt:Secret"] ?? "media-relations-development-secret-key-please-change";
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
            });
    }

    private static void ConfigureAuthorization(IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            foreach (var permission in MediaRelationPermissions.All)
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
                .AddSource("Sathus.MediaRelations")
                .AddAspNetCoreInstrumentation()
                .AddConsoleExporter())
            .WithMetrics(metrics => metrics
                .AddMeter(MediaRelationsMetrics.MeterName)
                .AddAspNetCoreInstrumentation()
                .AddConsoleExporter());
    }
}
