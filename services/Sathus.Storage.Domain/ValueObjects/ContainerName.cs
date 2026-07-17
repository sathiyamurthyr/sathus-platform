namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct ContainerName(string Value)
{
    public static ContainerName Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Container name cannot be empty.", nameof(value));

        value = value.Trim().ToLowerInvariant();

        if (value.Length < 3 || value.Length > 63)
            throw new ArgumentException("Container name must be between 3 and 63 characters.", nameof(value));

        if (!System.Text.RegularExpressions.Regex.IsMatch(value, "^[a-z0-9][a-z0-9-]*[a-z0-9]$"))
            throw new ArgumentException("Container name contains invalid characters.", nameof(value));

        return new ContainerName(value);
    }

    public static implicit operator string(ContainerName name) => name.Value;
    public override string ToString() => Value;
}
