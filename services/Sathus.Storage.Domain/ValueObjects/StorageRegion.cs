namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct StorageRegion(string Value)
{
    public static StorageRegion Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Region cannot be empty.", nameof(value));

        value = value.Trim().ToLowerInvariant();

        if (value.Length > 64)
            throw new ArgumentException("Region exceeds maximum length of 64.", nameof(value));

        return new StorageRegion(value);
    }

    public static implicit operator string(StorageRegion region) => region.Value;
    public override string ToString() => Value;
}
