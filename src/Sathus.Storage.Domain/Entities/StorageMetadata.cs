namespace Sathus.Storage.Domain.Entities;

public sealed class StorageMetadata
{
    public string Key { get; private set; } = string.Empty;
    public string? ContentType { get; private set; }
    public long? ContentLength { get; private set; }
    public string? ETag { get; private set; }
    public string? VersionId { get; private set; }
    public DateTimeOffset? LastModified { get; private set; }
    public bool IsVersioned { get; private set; }
    public Dictionary<string, string> Metadata { get; private set; } = new();
    public Dictionary<string, string> UserMetadata { get; private set; } = new();

    public static StorageMetadata Create(string key, string? contentType = null, long? contentLength = null, string? eTag = null, bool isVersioned = false)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return new StorageMetadata
        {
            Key = key,
            ContentType = contentType,
            ContentLength = contentLength,
            ETag = eTag,
            IsVersioned = isVersioned,
            LastModified = DateTimeOffset.UtcNow
        };
    }

    public void SetETag(string eTag)
    {
        ETag = eTag;
    }

    public void SetVersion(string versionId)
    {
        VersionId = versionId;
        IsVersioned = true;
    }

    public void SetContentType(string contentType)
    {
        ContentType = contentType;
    }

    public void SetUserMetadata(Dictionary<string, string> metadata)
    {
        UserMetadata = metadata ?? new Dictionary<string, string>();
    }

    public void UpdateLastModified(DateTimeOffset timestamp)
    {
        LastModified = timestamp;
    }
}
