namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchFieldId(Guid Value)
{
    public static SearchFieldId New() => new(Guid.NewGuid());
    public static SearchFieldId From(Guid value) => value == Guid.Empty ? throw new ArgumentException("SearchFieldId cannot be empty.", nameof(value)) : new SearchFieldId(value);
    public override string ToString() => Value.ToString();
}
