namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchScore
{
    public double Value { get; private set; }

    public SearchScore(double value)
    {
        if (double.IsNaN(value) || double.IsInfinity(value))
            throw new ArgumentException("Score must be a valid number.", nameof(value));

        Value = value;
    }

    public static SearchScore Create(double value) => new(value);

    public void Update(double value) => Value = value;

    public static implicit operator double(SearchScore score) => score.Value;
}
