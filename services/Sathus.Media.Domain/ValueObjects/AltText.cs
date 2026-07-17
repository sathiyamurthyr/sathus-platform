namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// Alternative text used for accessibility and SEO. Maps to an optional EF owned type.
/// </summary>
public sealed record AltText
{
    public string? Value { get; set; }

    public const int MaxLength = 512;

    public AltText()
    {
    }

    private AltText(string? value) => Value = value;

    public static AltText? Create(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();
        if (trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"Alt text must be at most {MaxLength} characters.", nameof(value));
        }

        return new AltText { Value = trimmed };
    }

    public override string ToString() => Value ?? string.Empty;
}
