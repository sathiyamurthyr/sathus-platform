using System.Text.RegularExpressions;

namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// ISO 639-1 language code for localized asset variants. Maps to an EF owned type.
/// </summary>
public sealed record LanguageCode
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 10;

    private static readonly Regex Pattern = new("^[a-z]{2}(-[A-Z]{2})?$", RegexOptions.Compiled);

    public LanguageCode()
    {
    }

    private LanguageCode(string value) => Value = value;

    public static LanguageCode Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Language code is required.", nameof(value));
        }

        var trimmed = value.Trim();
        if (trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"Language code must be at most {MaxLength} characters.", nameof(value));
        }

        if (!Pattern.IsMatch(trimmed))
        {
            throw new ArgumentException("Language code must be a valid ISO 639-1 code (e.g. 'en', 'en-US').", nameof(value));
        }

        return new LanguageCode { Value = trimmed.ToLowerInvariant() };
    }

    public static LanguageCode Default => new() { Value = "en" };

    public override string ToString() => Value;
}
