using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.ValueObjects;

namespace Sathus.Storage.Domain.Results;

public sealed record StorageObjectInfo(
    StorageKey Key,
    StorageSize Size,
    ContentType? ContentType,
    string? ETag,
    string? VersionId,
    DateTimeOffset? LastModified,
    DateTimeOffset? CreatedAt,
    StorageProviderType Provider,
    bool IsVersioned);
