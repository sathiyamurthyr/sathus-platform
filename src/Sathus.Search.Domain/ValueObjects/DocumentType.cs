namespace Sathus.Search.Domain.ValueObjects;

public sealed record DocumentType(string Value)
{
    public static DocumentType Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) throw new ArgumentException("Document type cannot be empty.", nameof(value));
        return new DocumentType(value.Trim().ToLowerInvariant());
    }
    public override string ToString() => Value;
    public static implicit operator string(DocumentType type) => type.Value;
}
