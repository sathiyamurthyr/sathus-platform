namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchIndexId(Guid Value)
{
    public static SearchIndexId New() => new(Guid.NewGuid());
    public static SearchIndexId From(Guid value) => value == Guid.Empty ? throw new ArgumentException("SearchIndexId cannot be empty.", nameof(value)) : new SearchIndexId(value);
    public override string ToString() => Value.ToString();
}
