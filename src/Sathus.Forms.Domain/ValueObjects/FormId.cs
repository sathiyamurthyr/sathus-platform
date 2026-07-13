namespace Sathus.Forms.Domain.ValueObjects;

/// <summary>Strongly-typed identifier for a form definition.</summary>
public sealed record FormId(Guid Value)
{
    public static FormId New() => new(Guid.NewGuid());

    public static FormId From(Guid value)
    {
        if (value == Guid.Empty)
        {
            throw new ArgumentException("FormId cannot be empty.", nameof(value));
        }

        return new FormId(value);
    }

    public override string ToString() => Value.ToString();
}
