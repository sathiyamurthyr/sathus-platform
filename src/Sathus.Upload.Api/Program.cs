using System;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Sathus.Upload.Api.Extensions;
using Sathus.Upload.Api.Middleware;
using Sathus.Upload.Infrastructure.Extensions;
using Serilog;

namespace Sathus.Upload.Api;

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
                .Enrich.WithProperty("Application", "Sathus.Upload")
                .WriteTo.Console();
        });

        builder.Services.AddUploadApi(builder.Configuration);

        var app = builder.Build();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseMiddleware<CorrelationIdMiddleware>();
        app.UseMiddleware<UploadExceptionMiddleware>();

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.MapHealthChecks("/health");

        app.Run();
    }
}
