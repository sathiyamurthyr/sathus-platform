using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace Sathus.Storage.Api.Filters;

public sealed class CorrelationIdFilter : IActionFilter
{
    private const string CorrelationIdHeader = "X-Correlation-ID";
    private readonly ILogger<CorrelationIdFilter> _logger;

    public CorrelationIdFilter(ILogger<CorrelationIdFilter> logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var correlationId = context.HttpContext.Request.Headers[CorrelationIdHeader].FirstOrDefault() ?? Guid.NewGuid().ToString();
        context.HttpContext.Items["CorrelationId"] = correlationId;
        context.HttpContext.Response.Headers[CorrelationIdHeader] = correlationId;
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        _logger.LogInformation("Request completed with correlation ID {CorrelationId}.", context.HttpContext.Items["CorrelationId"]);
    }
}
