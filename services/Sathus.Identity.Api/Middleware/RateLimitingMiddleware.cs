using System.Collections.Concurrent;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Api.Middleware;

public sealed class RateLimitingMiddleware
{
    private static readonly ConcurrentDictionary<string, List<DateTime>> Attempts = new();

    private static readonly HashSet<string> LimitedPaths = new(StringComparer.OrdinalIgnoreCase)
    {
        "/api/auth/login",
        "/api/auth/register"
    };

    private const int MaxAttempts = 5;
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(1);
    private static readonly TimeSpan RetryAfter = TimeSpan.FromMinutes(1);

    private readonly RequestDelegate _next;

    public RateLimitingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.ToString();

        if (LimitedPaths.Contains(path))
        {
            var key = GetClientIp(context);
            var now = DateTime.UtcNow;

            var timestamps = Attempts.GetOrAdd(key, _ => new List<DateTime>());

            List<DateTime> snapshot;
            lock (timestamps)
            {
                timestamps.RemoveAll(stamp => now - stamp > Window);
                snapshot = new List<DateTime>(timestamps);
            }

            if (snapshot.Count >= MaxAttempts)
            {
                context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                context.Response.Headers.RetryAfter = ((int)RetryAfter.TotalSeconds).ToString();
                context.Response.ContentType = "application/json";

                var response = new ErrorResponse(
                    "RATE_LIMIT_EXCEEDED",
                    "Too many attempts. Please try again later.");
                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
                return;
            }

            lock (timestamps)
            {
                timestamps.Add(now);
            }
        }

        await _next(context);
    }

    private static string GetClientIp(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("X-Forwarded-For", out var forwarded) &&
            forwarded.Count > 0 &&
            !string.IsNullOrWhiteSpace(forwarded[0]))
        {
            var first = forwarded[0]!.Split(',')[0].Trim();
            if (!string.IsNullOrWhiteSpace(first))
            {
                return first;
            }
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}
