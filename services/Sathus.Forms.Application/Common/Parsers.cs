using System;
using Sathus.Forms.Domain.Enums;

namespace Sathus.Forms.Application.Common;

/// <summary>Helpers for parsing client-supplied enum strings into domain enums.</summary>
public static class Parsers
{
    public static TEnum ParseEnum<TEnum>(string? value, TEnum fallback) where TEnum : struct, Enum
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return fallback;
        }

        return Enum.TryParse<TEnum>(value, ignoreCase: true, out var parsed) ? parsed : fallback;
    }

    public static FieldType ParseFieldType(string? value) => ParseEnum(value, FieldType.Text);
}
