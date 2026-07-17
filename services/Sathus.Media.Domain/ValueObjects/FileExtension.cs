using System.Text.RegularExpressions;

namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// File extension (without the leading dot). Maps to an EF owned type.
/// </summary>
public sealed record FileExtension
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 20;

    private static readonly Regex Pattern = new("^[a-z0-9]{1,20}$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public FileExtension()
    {
    }

    private FileExtension(string value) => Value = value;

    public static FileExtension Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("File extension is required.", nameof(value));
        }

        var normalized = value.Trim().TrimStart('.').ToLowerInvariant();
        if (normalized.Length == 0 || normalized.Length > MaxLength)
        {
            throw new ArgumentException($"File extension must be between 1 and {MaxLength} characters.", nameof(value));
        }

        if (!Pattern.IsMatch(normalized))
        {
            throw new ArgumentException("File extension contains invalid characters.", nameof(value));
        }

        return new FileExtension { Value = normalized };
    }

    public override string ToString() => Value;
}
