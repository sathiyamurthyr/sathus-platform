using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchSort
{
    public string Field { get; private set; }
    public SortDirection Direction { get; private set; }

    public SearchSort(string field, SortDirection direction)
    {
        Field = string.IsNullOrWhiteSpace(field) ? throw new ArgumentException("Field is required.", nameof(field)) : field.Trim();
        Direction = direction;
    }

    public static SearchSort Create(string field, SortDirection direction) => new(field, direction);
}
