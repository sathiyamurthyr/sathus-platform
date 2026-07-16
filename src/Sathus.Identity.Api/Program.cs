using System;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Sathus.Identity.Api.Extensions;
using Sathus.Identity.Api.Middleware;
using Sathus.Identity.Application.Commands.Login;
using Sathus.Identity.Application.Validators;
using Sathus.Identity.Infrastructure.Persistence;
using Sathus.Identity.Infrastructure.Repositories;
using Sathus.Identity.Infrastructure.Services;
using Serilog;

namespace Sathus.Identity.Api;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Host.UseSerilog((context, _, loggerConfiguration) =>
        {
            var config = context.Configuration;
            var level = config.GetValue<string>("Serilog:MinimumLevel") ?? "Information";
            var connectionString = config.GetConnectionString("DefaultConnection")!;

            loggerConfiguration
                .MinimumLevel.Is(Enum.Parse<Serilog.Events.LogEventLevel>(level))
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.PostgreSQL(
                    connectionString,
                    "logs",
                    restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Information);
        });

        builder.Services.AddIdentityServices(builder.Configuration);

        var app = builder.Build();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseHttpsRedirection();
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        app.UseMiddleware<RateLimitingMiddleware>();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}
