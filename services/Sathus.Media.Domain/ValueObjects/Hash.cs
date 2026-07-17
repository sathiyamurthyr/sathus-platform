using System.Text.RegularExpressions;

namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// Perceptual or content hash used for near-duplicate detection. Maps to an optional
/// EF owned type.
/// </summary>
public sealed record Hash
{
    public string? Value { get; set; }

    public const int MaxLength = 128;

    private static readonly Regex Pattern = new("^[a-f0-9]{8,128}$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public Hash()
    {
    }

    private Hash(string? value) => Value = value;

    public static Hash? Create(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();
        if (trimmed.Length > MaxLength || !Pattern.IsMatch(trimmed))
        {
            throw new ArgumentException("Hash is not a valid hexadecimal fingerprint.", nameof(value));
        }

        return new Hash { Value = trimmed.ToLowerInvariant() };
    }

    public override string ToString() => Value ?? string.Empty;
}
