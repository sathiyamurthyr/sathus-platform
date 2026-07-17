using System.Text;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using Sathus.Search.Api.HealthChecks;
using Sathus.Search.Application.Commands.IndexDocument;
using Sathus.Search.Application.Validators;
using Sathus.Search.Domain;
using Sathus.Search.Infrastructure.Extensions;

namespace Sathus.Search.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSearchApi(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddControllers()
            .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNameCaseInsensitive = true);

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "Sathus Search API", Version = "v1" });
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

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=sathus_search;Username=postgres;Password=postgres";

        services.AddSearchInfrastructure(connectionString);

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(IndexDocumentCommand).Assembly);
            config.AddOpenBehavior(typeof(Sathus.Search.Application.Behaviors.ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssemblyContaining<IndexDocumentCommand>();

        services.AddProblemDetails(options =>
        {
            options.CustomizeProblemDetails = ctx =>
            {
                ctx.ProblemDetails.Instance = ctx.HttpContext.Request.Path;
                if (!ctx.ProblemDetails.Extensions.TryGetValue("correlationId", out var existing) ||
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
            .AddCheck<SearchDbContextHealthCheck>("search-database");

        return services;
    }

    private static void ConfigureAuthentication(IServiceCollection services, IConfiguration configuration)
    {
        var secret = configuration["Jwt:Secret"] ?? "search-development-secret-key-please-change";
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
            foreach (var permission in SearchPermissions.All)
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
                .AddSource("Sathus.Search")
                .AddAspNetCoreInstrumentation()
                .AddConsoleExporter())
            .WithMetrics(metrics => metrics
                .AddAspNetCoreInstrumentation()
                .AddConsoleExporter());
    }
}
