namespace Sathus.SharedKernel.Entities;

public abstract class EntityId
{
    public Guid Value { get; }

    protected EntityId(Guid value)
    {
        Value = value == Guid.Empty ? throw new ArgumentException("ID cannot be empty.", nameof(value)) : value;
    }

    public override string ToString() => Value.ToString();
}
