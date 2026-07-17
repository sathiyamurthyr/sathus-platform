namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// File name with length and character validation. Maps to an EF owned type.
/// </summary>
public sealed record FileName
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 512;

    public FileName()
    {
    }

    private FileName(string value) => Value = value;

    public static FileName Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("File name is required.", nameof(value));
        }

        var trimmed = value.Trim();
        if (trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"File name must be at most {MaxLength} characters.", nameof(value));
        }

        if (trimmed.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
        {
            throw new ArgumentException("File name contains invalid characters.", nameof(value));
        }

        return new FileName { Value = trimmed };
    }

    public override string ToString() => Value;
}
