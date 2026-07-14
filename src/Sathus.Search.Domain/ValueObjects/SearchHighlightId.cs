namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchHighlightId(Guid Value)
{
    public static SearchHighlightId New() => new(Guid.NewGuid());
    public static SearchHighlightId From(Guid value) => value == Guid.Empty ? throw new ArgumentException("SearchHighlightId cannot be empty.", nameof(value)) : new SearchHighlightId(value);
    public override string ToString() => Value.ToString();
}
