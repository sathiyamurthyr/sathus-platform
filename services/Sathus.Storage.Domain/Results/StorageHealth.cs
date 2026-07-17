namespace Sathus.Storage.Domain.Results;

public sealed record StorageHealth(
    string ProviderName,
    bool IsHealthy,
    string? Latency = null,
    string? ErrorMessage = null,
    DateTimeOffset CheckedAt = default);
