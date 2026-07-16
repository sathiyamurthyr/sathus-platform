using System;
using Sathus.Search.Api.Extensions;
using Sathus.Search.Api.Middleware;
using Serilog;

namespace Sathus.Search.Api;

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
                .Enrich.WithProperty("Application", "Sathus.Search")
                .WriteTo.Console();
        });

        builder.Services.AddSearchApi(builder.Configuration);

        var app = builder.Build();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseMiddleware<CorrelationIdMiddleware>();
        app.UseMiddleware<SearchExceptionMiddleware>();

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.MapHealthChecks("/health");

        app.Run();
    }
}
