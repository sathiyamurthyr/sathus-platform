using System.Text.RegularExpressions;

namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// Checksum (integrity hash) produced by the storage layer. Maps to an EF owned type.
/// </summary>
public sealed record Checksum
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 256;

    private static readonly Regex Pattern =
        new(@"^(sha256|sha512|md5):[a-f0-9]{1,128}$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public Checksum()
    {
    }

    private Checksum(string value) => Value = value;

    public static Checksum Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Checksum is required.", nameof(value));
        }

        var trimmed = value.Trim();
        if (trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"Checksum must be at most {MaxLength} characters.", nameof(value));
        }

        if (!Pattern.IsMatch(trimmed))
        {
            throw new ArgumentException("Checksum must be in the form 'algorithm:hex' (e.g. 'sha256:...').", nameof(value));
        }

        return new Checksum { Value = trimmed.ToLowerInvariant() };
    }

    public override string ToString() => Value;
}
