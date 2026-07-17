using System;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Sathus.Processing.Api.Extensions;
using Sathus.Processing.Api.Middleware;
using Sathus.Processing.Infrastructure.Extensions;
using Serilog;

namespace Sathus.Processing.Api;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Host.UseSerilog((context, _, loggerConfiguration) =>
        {
            var level = context.Configuration.GetValue<string>("Serilog:MinimumLevel") ?? "Information";

            loggerConfiguration
                .MinimumLevel.Is(Enum.Parse<Serilog.Events.LogEventLevel>(level))
                .Enrich.FromLogContext()
                .Enrich.WithProperty("Application", "Sathus.Processing")
                .WriteTo.Console();
        });

        builder.Services.AddProcessingApi(builder.Configuration);

        var app = builder.Build();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseMiddleware<CorrelationIdMiddleware>();
        app.UseMiddleware<ProcessingExceptionMiddleware>();

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.MapHealthChecks("/health");

        app.Run();
    }
}
