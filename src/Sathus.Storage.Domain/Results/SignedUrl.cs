using Sathus.Storage.Domain.ValueObjects;

namespace Sathus.Storage.Domain.Results;

public sealed record SignedUrl(
    string Url,
    StorageEndpoint Endpoint,
    DateTimeOffset ExpiresAt,
    string? HttpMethod = null);
