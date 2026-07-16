namespace Sathus.MediaRelations.Domain.ValueObjects;

/// <summary>
/// The distance of a dependency from the root asset during graph traversal.
/// Level 0 is a direct dependency; anything greater is transitive.
/// </summary>
public sealed record DependencyLevel
{
    public int Value { get; set; }

    public const int MaxValue = 64;

    public static readonly DependencyLevel Direct = new(0);

    public DependencyLevel()
    {
    }

    private DependencyLevel(int value) => Value = value;

    public static DependencyLevel Create(int value)
    {
        if (value < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(value), "Dependency level cannot be negative.");
        }

        if (value > MaxValue)
        {
            throw new ArgumentOutOfRangeException(nameof(value), $"Dependency level cannot exceed {MaxValue}.");
        }

        return new DependencyLevel(value);
    }

    public bool IsDirect => Value == 0;

    public bool IsTransitive => Value > 0;

    public DependencyLevel Next() => Create(Value + 1);

    public override string ToString() => Value.ToString();
}
