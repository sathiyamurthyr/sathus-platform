namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct ContentType(string Value)
{
    public static ContentType Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Content type cannot be empty.", nameof(value));

        if (!value.Contains("/"))
            throw new ArgumentException("Content type must be in the form type/subtype.", nameof(value));

        var parts = value.Split('/');
        if (parts.Length != 2 || string.IsNullOrWhiteSpace(parts[0]) || string.IsNullOrWhiteSpace(parts[1]))
            throw new ArgumentException("Content type is malformed.", nameof(value));

        return new ContentType(value.Trim().ToLowerInvariant());
    }

    public string Extension => Value.Split('/').Last().Split('+').First().Split(';').First().Trim();

    public static implicit operator string(ContentType type) => type.Value;
    public override string ToString() => Value;
}
