namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchFacetId(Guid Value)
{
    public static SearchFacetId New() => new(Guid.NewGuid());
    public static SearchFacetId From(Guid value) => value == Guid.Empty ? throw new ArgumentException("SearchFacetId cannot be empty.", nameof(value)) : new SearchFacetId(value);
    public override string ToString() => Value.ToString();
}
