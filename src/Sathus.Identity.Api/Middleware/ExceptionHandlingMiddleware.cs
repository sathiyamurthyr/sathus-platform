using System.Net;
using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;

namespace Sathus.Identity.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
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
        var environment = context.RequestServices.GetService<IHostEnvironment>();
        var isDevelopment = environment?.IsDevelopment() == true;

        var (code, statusCode) = exception switch
        {
            AccountLockedException => ("ACCOUNT_LOCKED", StatusCodes.Status423Locked),
            AuthenticationException => ("AUTHENTICATION_FAILED", StatusCodes.Status401Unauthorized),
            InvalidTokenException => ("INVALID_TOKEN", StatusCodes.Status400BadRequest),
            UserNotFoundException => ("USER_NOT_FOUND", StatusCodes.Status404NotFound),
            EmailAlreadyExistsException => ("EMAIL_EXISTS", StatusCodes.Status409Conflict),
            AppException => ("BAD_REQUEST", StatusCodes.Status400BadRequest),
            ValidationException => ("VALIDATION_ERROR", StatusCodes.Status422UnprocessableEntity),
            _ => ("INTERNAL_SERVER_ERROR", StatusCodes.Status500InternalServerError)
        };

        var message = statusCode == (int)HttpStatusCode.InternalServerError && !isDevelopment
            ? "An unexpected error occurred. Please try again later."
            : exception.Message;

        IReadOnlyList<string>? details = isDevelopment ? new List<string> { exception.ToString() } : null;

        _logger.LogError(exception, "Unhandled exception while processing {Path}", context.Request.Path);

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var response = new ErrorResponse(code, message, details);
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
