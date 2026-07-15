namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchExternalId
{
    public string Value { get; private set; }

    public SearchExternalId(string value)
    {
        Value = string.IsNullOrWhiteSpace(value) ? throw new ArgumentException("ExternalId is required.", nameof(value)) : value;
    }

    public static SearchExternalId Create(string value) => new(value);

    public static implicit operator string(SearchExternalId id) => id.Value;
}
