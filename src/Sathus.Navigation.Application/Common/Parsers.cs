using System;

namespace Sathus.Navigation.Application.Common;

/// <summary>
/// Helpers for converting transport strings into strongly-typed domain enums/value objects.
/// </summary>
public static class Parsers
{
    public static T ParseEnum<T>(string? raw, T fallback) where T : struct, Enum
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            return fallback;
        }

        return Enum.TryParse<T>(raw, ignoreCase: true, out var value) ? value : fallback;
    }

    public static Platform ParsePlatform(string? raw) =>
        Enum.TryParse<Platform>(raw, ignoreCase: true, out var value) ? value : Platform.Website;

    public static MenuType ParseMenuType(string? raw) => string.IsNullOrWhiteSpace(raw)
        ? MenuType.Main
        : MenuType.Create(raw);
}
