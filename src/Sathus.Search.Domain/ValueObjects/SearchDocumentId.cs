namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchDocumentId(Guid Value)
{
    public static SearchDocumentId New() => new(Guid.NewGuid());
    public static SearchDocumentId From(Guid value) => value == Guid.Empty ? throw new ArgumentException("SearchDocumentId cannot be empty.", nameof(value)) : new SearchDocumentId(value);
    public override string ToString() => Value.ToString();
}
