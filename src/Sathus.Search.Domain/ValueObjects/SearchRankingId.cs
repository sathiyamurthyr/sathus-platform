namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchRankingId(Guid Value)
{
    public static SearchRankingId New() => new(Guid.NewGuid());
    public static SearchRankingId From(Guid value) => value == Guid.Empty ? throw new ArgumentException("SearchRankingId cannot be empty.", nameof(value)) : new SearchRankingId(value);
    public override string ToString() => Value.ToString();
}
