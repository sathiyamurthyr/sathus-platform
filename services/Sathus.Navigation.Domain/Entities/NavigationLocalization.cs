using System.Text.RegularExpressions;

namespace Sathus.Navigation.Domain.Entities;

/// <summary>
/// A localized label/route for a node, menu or tree. Supports multi-language display names,
/// localized routes and a designated fallback language.
/// </summary>
public sealed class NavigationLocalization
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public string LanguageCode { get; init; } = "en";

    public string DisplayName { get; init; } = string.Empty;

    public string? RoutePath { get; init; }

    public bool IsFallback { get; init; }

    public static NavigationLocalization Create(
        string languageCode,
        string displayName,
        string? routePath = null,
        bool isFallback = false)
    {
        if (string.IsNullOrWhiteSpace(languageCode))
        {
            throw new ArgumentException("Language code is required.", nameof(languageCode));
        }

        if (string.IsNullOrWhiteSpace(displayName))
        {
            throw new ArgumentException("Display name is required.", nameof(displayName));
        }

        var lang = languageCode.Trim().ToLowerInvariant();
        if (!Regex.IsMatch(lang, "^[a-z]{2}(-[a-z]{2})?$"))
        {
            throw new ArgumentException("Language code must be a valid ISO 639-1 code (e.g. 'en', 'en-US').", nameof(languageCode));
        }

        string? normalizedRoute = null;
        if (!string.IsNullOrWhiteSpace(routePath))
        {
            var r = routePath!.Trim();
            if (!r.StartsWith("/") && !r.StartsWith("http", StringComparison.OrdinalIgnoreCase))
            {
                r = "/" + r;
            }

            normalizedRoute = r;
        }

        return new NavigationLocalization
        {
            LanguageCode = lang,
            DisplayName = displayName.Trim(),
            RoutePath = normalizedRoute,
            IsFallback = isFallback
        };
    }
}
