namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchTerm(string Value)
{
    public static SearchTerm Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) throw new ArgumentException("Search term cannot be empty.", nameof(value));
        return new SearchTerm(value.Trim());
    }
    public override string ToString() => Value;
}
