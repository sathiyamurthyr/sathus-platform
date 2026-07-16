namespace Sathus.Storage.Application.DTOs;

public sealed record HealthResponse(
    string ProviderName,
    bool IsHealthy,
    string? Latency,
    string? ErrorMessage,
    DateTimeOffset CheckedAt);
