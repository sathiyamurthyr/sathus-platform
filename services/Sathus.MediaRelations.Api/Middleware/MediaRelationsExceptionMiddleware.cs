using System.Net;
using System.Text.Json;
using FluentValidation;
using Sathus.MediaRelations.Domain.Exceptions;
using Sathus.SharedKernel.Exceptions;

namespace Sathus.MediaRelations.Api.Middleware;

/// <summary>
/// Converts domain/application exceptions into RFC7807 problem+json responses with a
/// correlation id, keeping the error contract consistent across the platform.
/// </summary>
public sealed class MediaRelationsExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<MediaRelationsExceptionMiddleware> _logger;

    public MediaRelationsExceptionMiddleware(RequestDelegate next, ILogger<MediaRelationsExceptionMiddleware> logger)
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
            MediaReferenceNotFoundException or MediaUsageStatisticsNotFoundException =>
                Build((int)HttpStatusCode.NotFound, "Not Found", exception.Message),
            AssetDeletionBlockedException =>
                Build((int)HttpStatusCode.Conflict, "Deletion Blocked", exception.Message),
            DuplicateReferenceException =>
                Build((int)HttpStatusCode.Conflict, "Duplicate Reference", exception.Message),
            InvalidReferenceStateException or CircularDependencyException =>
                Build((int)HttpStatusCode.BadRequest, "Bad Request", exception.Message),
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

    private static ProblemDetails Build(int status, string title, string detail, object? errors = null)
    {
        var problem = new ProblemDetails
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
