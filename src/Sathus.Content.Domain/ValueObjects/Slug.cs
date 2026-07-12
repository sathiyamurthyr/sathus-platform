namespace Sathus.Content.Domain.ValueObjects;

public sealed record Slug(string Value)
{
    public static Slug Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Slug cannot be empty.", nameof(value));
        }

        var normalized = value.Trim().ToLowerInvariant();
        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, @"\s+", "-");
        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, @"[^a-z0-9-]", "");

        if (normalized.Length > 256)
        {
            normalized = normalized[..256];
        }

        return new Slug(normalized);
    }

    public override string ToString() => Value;
}
