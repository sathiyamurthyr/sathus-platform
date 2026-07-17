using Microsoft.AspNetCore.Mvc.Filters;
using Sathus.Identity.Api.Extensions;
using Sathus.Identity.Application.Interfaces;

namespace Sathus.Identity.Api.Filters;

public sealed class AuditLoggingFilter : IAsyncActionFilter
{
    private readonly IAuditService _audit;

    public AuditLoggingFilter(IAuditService audit)
    {
        _audit = audit;
    }

    public async Task OnActionExecutionAsync(
        ActionExecutingContext context,
        ActionExecutionDelegate next)
    {
        var executed = await next();

        if (executed.HttpContext.User.Identity?.IsAuthenticated != true)
        {
            return;
        }

        var userId = executed.HttpContext.User.GetUserId();
        var routeData = executed.RouteData.Values;
        var controller = routeData["controller"]?.ToString() ?? "Unknown";
        var action = routeData["action"]?.ToString() ?? "Unknown";

        await _audit.LogAsync(new AuditEntry(
            Action: $"{controller}.{action}",
            EntityName: controller,
            UserId: userId,
            EntityId: userId?.ToString()));
    }
}
