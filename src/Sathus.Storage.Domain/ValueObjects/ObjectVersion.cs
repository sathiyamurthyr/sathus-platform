namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct ObjectVersion(string Value)
{
    public static ObjectVersion Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Object version cannot be empty.", nameof(value));

        if (value.Length > 64)
            throw new ArgumentException("Object version exceeds maximum length of 64.", nameof(value));

        return new ObjectVersion(value.Trim());
    }

    public static ObjectVersion Generate()
    {
        return new ObjectVersion(Guid.NewGuid().ToString("N"));
    }

    public static implicit operator string(ObjectVersion version) => version.Value;
    public override string ToString() => Value;
}
