using System.Text.RegularExpressions;

namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// MIME type with RFC 6838 media-type validation. Maps to an EF owned type.
/// </summary>
public sealed record MimeType
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 128;

    private static readonly Regex Pattern =
        new(@"^[a-z0-9][a-z0-9!#$&\-\^_]*\/[a-z0-9][a-z0-9!#$&\-\^_.]*$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public MimeType()
    {
    }

    private MimeType(string value) => Value = value;

    public static MimeType Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("MIME type is required.", nameof(value));
        }

        var trimmed = value.Trim();
        if (trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"MIME type must be at most {MaxLength} characters.", nameof(value));
        }

        if (!Pattern.IsMatch(trimmed))
        {
            throw new ArgumentException("MIME type is not in a valid format (type/subtype).", nameof(value));
        }

        return new MimeType { Value = trimmed.ToLowerInvariant() };
    }

    public string TopLevelType => Value.Split('/')[0];

    public override string ToString() => Value;
}
