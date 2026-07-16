using System.Text.RegularExpressions;

namespace Sathus.Navigation.Domain.ValueObjects;

/// <summary>
/// A normalized navigation route path. Internal paths always start with a leading slash
/// and are trimmed; external targets are stored verbatim as absolute URLs.
/// </summary>
public sealed record RoutePath
{
    public string Value { get; }

    public bool IsExternal { get; }

    public const int MaxLength = 2048;

    private static readonly Regex InternalPattern = new("^[a-z0-9\\-._~%/$&'()*+,;=:@]+$", RegexOptions.Compiled);

    private RoutePath(string value, bool isExternal)
    {
        Value = value;
        IsExternal = isExternal;
    }

    public static RoutePath Create(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            throw new ArgumentException("Route path is required.", nameof(raw));
        }

        var trimmed = raw.Trim();

        if (trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"Route path must be at most {MaxLength} characters.", nameof(raw));
        }

        if (IsAbsoluteUrl(trimmed))
        {
            return new RoutePath(trimmed, true);
        }

        var normalized = NormalizeInternal(trimmed);

        if (!InternalPattern.IsMatch(normalized.TrimStart('/')))
        {
            throw new ArgumentException("Route path contains invalid characters.", nameof(raw));
        }

        return new RoutePath(normalized, false);
    }

    public static RoutePath External(string url)
    {
        if (string.IsNullOrWhiteSpace(url) || !IsAbsoluteUrl(url.Trim()))
        {
            throw new ArgumentException("External route must be an absolute URL.", nameof(url));
        }

        return new RoutePath(url.Trim(), true);
    }

    private static string NormalizeInternal(string raw)
    {
        var value = raw.ToLowerInvariant();
        if (!value.StartsWith("/", StringComparison.Ordinal))
        {
            value = "/" + value;
        }

        while (value.Length > 1 && value.EndsWith("/", StringComparison.Ordinal))
        {
            value = value.Substring(0, value.Length - 1);
        }

        value = value.Replace("//", "/");
        return value;
    }

    private static bool IsAbsoluteUrl(string value) =>
        value.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
        value.StartsWith("https://", StringComparison.OrdinalIgnoreCase) ||
        value.StartsWith("mailto:", StringComparison.OrdinalIgnoreCase) ||
        value.StartsWith("tel:", StringComparison.OrdinalIgnoreCase);

    public override string ToString() => Value;
}
