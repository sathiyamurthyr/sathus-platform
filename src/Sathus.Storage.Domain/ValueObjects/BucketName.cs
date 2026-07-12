namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct BucketName(string Value)
{
    public static BucketName Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Bucket name cannot be empty.", nameof(value));

        value = value.Trim().ToLowerInvariant();

        if (value.Length < 3 || value.Length > 63)
            throw new ArgumentException("Bucket name must be between 3 and 63 characters.", nameof(value));

        if (value.StartsWith("-") || value.EndsWith("-"))
            throw new ArgumentException("Bucket name cannot start or end with a hyphen.", nameof(value));

        if (!System.Text.RegularExpressions.Regex.IsMatch(value, "^[a-z0-9][a-z0-9-]*[a-z0-9]$"))
            throw new ArgumentException("Bucket name contains invalid characters.", nameof(value));

        return new BucketName(value);
    }

    public static implicit operator string(BucketName name) => name.Value;
    public override string ToString() => Value;
}
