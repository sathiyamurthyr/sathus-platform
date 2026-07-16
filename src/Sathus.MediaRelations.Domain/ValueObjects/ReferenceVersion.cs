namespace Sathus.MediaRelations.Domain.ValueObjects;

/// <summary>
/// Monotonically increasing version of a reference. Every mutation to a reference
/// produces a new version, enabling optimistic history tracking and snapshots.
/// </summary>
public sealed record ReferenceVersion
{
    public int Value { get; set; } = 1;

    public static readonly ReferenceVersion Initial = new(1);

    public ReferenceVersion()
    {
    }

    private ReferenceVersion(int value) => Value = value;

    public static ReferenceVersion Create(int value)
    {
        if (value < 1)
        {
            throw new ArgumentOutOfRangeException(nameof(value), "Reference version must be at least 1.");
        }

        return new ReferenceVersion(value);
    }

    public ReferenceVersion Next() => new(Value + 1);

    public override string ToString() => $"v{Value}";
}
