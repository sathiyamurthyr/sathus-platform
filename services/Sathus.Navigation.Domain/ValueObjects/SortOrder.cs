namespace Sathus.Navigation.Domain.ValueObjects;

/// <summary>
/// Zero-based sort order used to order sibling nodes within a menu.
/// </summary>
public readonly record struct SortOrder(int Value)
{
    public static readonly SortOrder Default = new(0);

    public static SortOrder Create(int value)
    {
        if (value < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(value), "Sort order must be non-negative.");
        }

        if (value > MaxValue)
        {
            throw new ArgumentOutOfRangeException(nameof(value), $"Sort order must not exceed {MaxValue}.");
        }

        return new SortOrder(value);
    }

    public const int MaxValue = 100_000;

    public static implicit operator int(SortOrder order) => order.Value;

    public override string ToString() => Value.ToString();
}
