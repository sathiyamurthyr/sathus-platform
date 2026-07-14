namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchSynonymId(Guid Value)
{
    public static SearchSynonymId New() => new(Guid.NewGuid());
    public static SearchSynonymId From(Guid value) => value == Guid.Empty ? throw new ArgumentException("SearchSynonymId cannot be empty.", nameof(value)) : new SearchSynonymId(value);
    public override string ToString() => Value.ToString();
}
