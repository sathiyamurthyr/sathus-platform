using Sathus.Storage.Domain.Enums;
namespace Sathus.Storage.Domain.Entities;

public sealed class StorageObject
{
    public string Key { get; private set; } = string.Empty;
    public string? BucketName { get; private set; }
    public string? ContainerName { get; private set; }
    public long? Size { get; private set; }
    public string? ContentType { get; private set; }
    public string? ETag { get; private set; }
    public string? VersionId { get; private set; }
    public DateTimeOffset? LastModified { get; private set; }
    public DateTimeOffset? CreatedAt { get; private set; }
    public string? StorageProvider { get; private set; }
    public Dictionary<string, string> Metadata { get; private set; } = new();
    public string? FolderPath { get; private set; }

    public static StorageObject Create(string key, StorageProviderType provider, string? bucketName = null, string? containerName = null, long? size = null, string? contentType = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return new StorageObject
        {
            Key = key,
            BucketName = bucketName,
            ContainerName = containerName,
            Size = size,
            ContentType = contentType,
            StorageProvider = provider.ToString(),
            CreatedAt = DateTimeOffset.UtcNow,
            LastModified = DateTimeOffset.UtcNow
        };
    }

    public void UpdateMetadata(string? contentType, long? size, string? eTag, string? versionId)
    {
        ContentType = contentType;
        Size = size;
        ETag = eTag;
        VersionId = versionId;
        LastModified = DateTimeOffset.UtcNow;
    }

    public void SetProvider(StorageProviderType provider)
    {
        StorageProvider = provider.ToString();
    }

    public void SetFolderPath(string folderPath)
    {
        FolderPath = folderPath;
    }
}
