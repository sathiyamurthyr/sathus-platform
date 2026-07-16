using System.Text;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Sathus.Storage.Api.Extensions;
using Sathus.Storage.Api.Filters;
using Sathus.Storage.Api.Middleware;
using Sathus.Storage.Application.Queries.GetConfig;
using Sathus.Storage.Application.Queries.GetHealth;
using Sathus.Storage.Application.Queries.GetProviders;
using Sathus.Storage.Domain;
using Sathus.Storage.Infrastructure.Extensions;
using Serilog;

namespace Sathus.Storage.Api;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Host.UseSerilog((context, _, loggerConfiguration) =>
        {
            var config = context.Configuration;
            var level = config.GetValue<string>("Serilog:MinimumLevel") ?? "Information";

            loggerConfiguration
                .MinimumLevel.Is(Enum.Parse<Serilog.Events.LogEventLevel>(level))
                .Enrich.FromLogContext()
                .WriteTo.Console();
        });

        builder.Services.AddStorage(builder.Configuration);
        builder.Services.AddStorageProviders(builder.Configuration);
        builder.Services.AddHealthChecks().AddStorageHealthChecks();

        builder.Services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(Program).Assembly);
            config.RegisterServicesFromAssembly(typeof(GetProvidersQuery).Assembly);
        });

        builder.Services.AddControllers(options => options.Filters.AddService<CorrelationIdFilter>());
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "Sathus Storage API", Version = "v1" });
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
                [new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }] = new List<string>()
            });
        });

        builder.Services.AddHttpClient();
        builder.Services.AddScoped<CorrelationIdFilter>();

        var app = builder.Build();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseHttpsRedirection();
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.MapHealthChecks("/health");

        app.Run();
    }
}
