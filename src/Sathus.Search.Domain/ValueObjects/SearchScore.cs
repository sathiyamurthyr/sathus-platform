namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchScore(double Value)
{
    public static SearchScore Zero => new(0);
    public static SearchScore Create(double value) => value < 0 ? throw new ArgumentException("Score cannot be negative.", nameof(value)) : new SearchScore(value);
    public static implicit operator double(SearchScore score) => score.Value;
    public override string ToString() => Value.ToString("0.00");
}
