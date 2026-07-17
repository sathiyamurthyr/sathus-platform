namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// Storage key (object/key path) locating the binary in the backing store.
/// Storage-provider agnostic. Maps to an EF owned type.
/// </summary>
public sealed record StorageKey
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 2048;

    public StorageKey()
    {
    }

    private StorageKey(string value) => Value = value;

    public static StorageKey Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Storage key is required.", nameof(value));
        }

        var trimmed = value.Trim().TrimStart('/');
        if (trimmed.Length == 0 || trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"Storage key must be between 1 and {MaxLength} characters.", nameof(value));
        }

        return new StorageKey { Value = trimmed };
    }

    public string? Bucket => Value.Contains('/') ? Value.Split('/')[0] : null;

    public string Key => Value.Contains('/') ? Value[(Value.IndexOf('/') + 1)..] : Value;

    public override string ToString() => Value;
}
