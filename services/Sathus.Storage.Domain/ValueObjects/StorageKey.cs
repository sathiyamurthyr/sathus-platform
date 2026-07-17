namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct StorageKey(string Value)
{
    public static StorageKey Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Storage key cannot be empty.", nameof(value));

        if (value.Length > 512)
            throw new ArgumentException("Storage key exceeds maximum length of 512.", nameof(value));

        if (value.Contains("..") || value.StartsWith("/") || value.Contains("//"))
            throw new ArgumentException("Storage key contains invalid path traversal sequences.", nameof(value));

        return new StorageKey(value.Trim().Replace('\\', '/'));
    }

    public static implicit operator string(StorageKey key) => key.Value;
    public override string ToString() => Value;
}
