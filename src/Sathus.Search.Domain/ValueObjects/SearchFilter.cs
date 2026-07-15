using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchFilter
{
    public string Field { get; private set; }
    public object Value { get; private set; }
    public FilterOperator Operator { get; private set; }

    public SearchFilter(string field, object value, FilterOperator op = FilterOperator.Equals)
    {
        Field = string.IsNullOrWhiteSpace(field) ? throw new ArgumentException("Field is required.", nameof(field)) : field;
        Value = value ?? throw new ArgumentNullException(nameof(value));
        Operator = op;
    }

    public static SearchFilter Create(string field, object value, FilterOperator op = FilterOperator.Equals) => new(field, value, op);
}

public enum FilterOperator
{
    Equals = 0,
    NotEquals = 1,
    Contains = 2,
    GreaterThan = 3,
    LessThan = 4,
    In = 5,
    Between = 6
}
