using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Sathus.Storage.Domain.Exceptions;

namespace Sathus.Storage.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json";

        var statusCode = exception switch
        {
            ObjectNotFoundException => (int)HttpStatusCode.NotFound,
            PermissionDeniedException => (int)HttpStatusCode.Forbidden,
            StorageUnavailableException => (int)HttpStatusCode.ServiceUnavailable,
            InvalidStorageConfigurationException => (int)HttpStatusCode.InternalServerError,
            StorageException => (int)HttpStatusCode.BadRequest,
            _ => (int)HttpStatusCode.InternalServerError
        };

        var errorCode = exception is StorageException storageEx && !string.IsNullOrEmpty(storageEx.ErrorCode)
            ? storageEx.ErrorCode
            : "storage.internal_error";

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = exception.Message,
            Detail = _environment.IsDevelopment() ? exception.ToString() : null,
            Type = $"https://httpstatuses.com/{statusCode}",
            Extensions = { ["errorCode"] = errorCode }
        };

        problem.Extensions["traceId"] = context.TraceIdentifier;

        var json = JsonSerializer.Serialize(problem);
        return context.Response.WriteAsync(json);
    }
}
