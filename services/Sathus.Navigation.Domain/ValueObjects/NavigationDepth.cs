namespace Sathus.Navigation.Domain.ValueObjects;

/// <summary>
/// Depth of a node within its tree (root nodes are depth 0).
/// </summary>
public readonly record struct NavigationDepth(int Value)
{
    public static readonly NavigationDepth Root = new(0);

    public static readonly NavigationDepth Max = new(64);

    public static NavigationDepth Create(int value)
    {
        if (value < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(value), "Depth must be non-negative.");
        }

        if (value > Max.Value)
        {
            throw new ArgumentOutOfRangeException(nameof(value), $"Depth must not exceed {Max.Value}.");
        }

        return new NavigationDepth(value);
    }

    public NavigationDepth Next() => Create(Value + 1);

    public static implicit operator int(NavigationDepth depth) => depth.Value;

    public override string ToString() => Value.ToString();
}
