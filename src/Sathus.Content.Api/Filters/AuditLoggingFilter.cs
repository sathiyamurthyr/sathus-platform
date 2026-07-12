using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Sathus.Content.Api.Extensions;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Entities;

namespace Sathus.Content.Api.Filters;

public sealed class AuditLoggingFilter : IAsyncResultFilter
{
    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        var userId = context.HttpContext.User.GetUserId();
        var audit = context.HttpContext.RequestServices.GetService<IAuditService>();

        if (audit is not null && context.Result is ObjectResult objectResult)
        {
            var controller = context.RouteData.Values["controller"]?.ToString();
            var action = context.RouteData.Values["action"]?.ToString();
            var entityId = objectResult.Value?.GetType().GetProperty("Id")?.GetValue(objectResult.Value)?.ToString();

            await audit.LogAsync(new AuditEntry(
                $"{controller}.{action}",
                controller ?? "Unknown",
                userId,
                entityId));
        }

        await next();
    }
}
