using System.Text.RegularExpressions;

namespace Sathus.Navigation.Domain.ValueObjects;

/// <summary>
/// Strongly-typed identifier for a navigation menu (a named slot such as Main, Footer).
/// </summary>
public sealed record MenuId(Guid Value)
{
    public static MenuId New() => new(Guid.NewGuid());

    public static MenuId From(Guid value)
    {
        if (value == Guid.Empty)
        {
            throw new ArgumentException("MenuId cannot be empty.", nameof(value));
        }

        return new MenuId(value);
    }

    public override string ToString() => Value.ToString();
}
