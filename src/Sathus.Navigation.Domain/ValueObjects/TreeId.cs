using System.Text.RegularExpressions;

namespace Sathus.Navigation.Domain.ValueObjects;

/// <summary>
/// Strongly-typed identifier for a navigation tree (the top-level aggregate).
/// </summary>
public sealed record TreeId(Guid Value)
{
    public static TreeId New() => new(Guid.NewGuid());

    public static TreeId From(Guid value)
    {
        if (value == Guid.Empty)
        {
            throw new ArgumentException("TreeId cannot be empty.", nameof(value));
        }

        return new TreeId(value);
    }

    public override string ToString() => Value.ToString();
}
