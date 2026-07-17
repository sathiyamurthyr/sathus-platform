namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchId
{
    public Guid Value { get; }

    public SearchId(Guid value)
    {
        Value = value == Guid.Empty ? throw new ArgumentException("ID cannot be empty.", nameof(value)) : value;
    }

    public static SearchId Create(Guid value) => new(value);
    public static SearchId CreateUnique() => new(Guid.NewGuid());

    public static implicit operator Guid(SearchId id) => id.Value;
}
