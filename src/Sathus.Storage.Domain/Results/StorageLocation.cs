using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.ValueObjects;

namespace Sathus.Storage.Domain.Results;

public sealed record StorageLocation(
    StorageProviderType Provider,
    string? BucketName,
    string? ContainerName,
    StorageEndpoint Endpoint,
    StorageRegion? Region);
