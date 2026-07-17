using System.Text.RegularExpressions;

namespace Sathus.Navigation.Domain.ValueObjects;

/// <summary>
/// Strongly-typed identifier for a navigation node (a vertex in the tree).
/// </summary>
public sealed record NodeId(Guid Value)
{
    public static NodeId New() => new(Guid.NewGuid());

    public static NodeId From(Guid value)
    {
        if (value == Guid.Empty)
        {
            throw new ArgumentException("NodeId cannot be empty.", nameof(value));
        }

        return new NodeId(value);
    }

    public override string ToString() => Value.ToString();
}
