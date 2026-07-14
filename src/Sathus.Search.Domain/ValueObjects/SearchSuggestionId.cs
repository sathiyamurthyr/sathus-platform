namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchSuggestionId(Guid Value)
{
    public static SearchSuggestionId New() => new(Guid.NewGuid());
    public static SearchSuggestionId From(Guid value) => value == Guid.Empty ? throw new ArgumentException("SearchSuggestionId cannot be empty.", nameof(value)) : new SearchSuggestionId(value);
    public override string ToString() => Value.ToString();
}
