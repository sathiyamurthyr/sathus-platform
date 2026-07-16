using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.ValueObjects;

namespace Sathus.Storage.Domain.Entities;

public sealed class StorageFolder
{
    public string Path { get; private set; } = string.Empty;
    public string? BucketName { get; private set; }
    public string? ContainerName { get; private set; }
    public StorageProviderType Provider { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public int ObjectCount { get; private set; }
    public long? TotalSize { get; private set; }

    public static StorageFolder Create(ObjectPath path, StorageProviderType provider, string? bucketName = null, string? containerName = null)
    {
        ArgumentNullException.ThrowIfNull(path);

        return new StorageFolder
        {
            Path = path.Value,
            BucketName = bucketName,
            ContainerName = containerName,
            Provider = provider,
            CreatedAt = DateTimeOffset.UtcNow,
            ObjectCount = 0,
            TotalSize = 0
        };
    }

    public void UpdateStats(int objectCount, long totalSize)
    {
        ObjectCount = objectCount;
        TotalSize = totalSize;
    }
}
