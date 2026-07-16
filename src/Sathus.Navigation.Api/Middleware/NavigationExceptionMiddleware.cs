using System.Net;
using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Sathus.Navigation.Domain.Exceptions;
using Sathus.SharedKernel.Exceptions;

namespace Sathus.Navigation.Api.Middleware;

/// <summary>
/// Maps exceptions to RFC 7807 ProblemDetails responses.
/// </summary>
public sealed class NavigationExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<NavigationExceptionMiddleware> _logger;

    public NavigationExceptionMiddleware(RequestDelegate next, ILogger<NavigationExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleAsync(context, exception);
        }
    }

    private async Task HandleAsync(HttpContext context, Exception exception)
    {
        var correlationId = context.TraceIdentifier;
        var problem = exception switch
        {
            ValidationException validation => Build(
                (int)HttpStatusCode.BadRequest,
                "Validation Failed",
                "One or more validation errors occurred.",
                validation.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray())),
            NavigationTreeNotFoundException or NavigationMenuNotFoundException or NavigationNodeNotFoundException or NavigationVersionNotFoundException =>
                Build((int)HttpStatusCode.NotFound, "Not Found", exception.Message),
            NavigationCircularReferenceException =>
                Build((int)HttpStatusCode.Conflict, "Circular Reference", exception.Message),
            NavigationDuplicateRouteException =>
                Build((int)HttpStatusCode.Conflict, "Duplicate Route", exception.Message),
            NavigationBrokenReferenceException =>
                Build((int)HttpStatusCode.BadRequest, "Broken Reference", exception.Message),
            NavigationInvalidOperationException =>
                Build((int)HttpStatusCode.BadRequest, "Invalid Operation", exception.Message),
            AppException app =>
                Build((int)HttpStatusCode.BadRequest, "Bad Request", app.Message),
            _ => Build((int)HttpStatusCode.InternalServerError, "Internal Server Error", "An unexpected error occurred.")
        };

        if (problem.Status is >= 500)
        {
            _logger.LogError(exception, "Unhandled exception {CorrelationId}", correlationId);
        }

        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = problem.Status ?? (int)HttpStatusCode.InternalServerError;

        var payload = new
        {
            problem.Type,
            problem.Title,
            problem.Status,
            problem.Detail,
            problem.Instance,
            Errors = problem.Extensions.TryGetValue("errors", out var errors) ? errors : null,
            CorrelationId = correlationId
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(payload, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }));
    }

    private static Microsoft.AspNetCore.Mvc.ProblemDetails Build(
        int status, string title, string detail, object? errors = null)
    {
        var problem = new Microsoft.AspNetCore.Mvc.ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = detail,
            Type = $"https://httpstatuses.io/{status}"
        };

        if (errors is not null)
        {
            problem.Extensions["errors"] = errors;
        }

        return problem;
    }
}
