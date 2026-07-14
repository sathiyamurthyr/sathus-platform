namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchFilter(string Field, string Value, string? Operator = null)
{
    public static SearchFilter Create(string field, string value, string? op = null)
    {
        if (string.IsNullOrWhiteSpace(field)) throw new ArgumentException("Field cannot be empty.", nameof(field));
        if (value is null) throw new ArgumentNullException(nameof(value));
        return new SearchFilter(field.Trim(), value.Trim(), op?.Trim());
    }
}
