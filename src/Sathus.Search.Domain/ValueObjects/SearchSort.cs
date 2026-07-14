using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchSort(string Field, SortDirection Direction)
{
    public static SearchSort Create(string field, SortDirection direction)
    {
        if (string.IsNullOrWhiteSpace(field)) throw new ArgumentException("Field cannot be empty.", nameof(field));
        return new SearchSort(field.Trim(), direction);
    }
}
