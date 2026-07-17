using Sathus.Forms.Domain.Enums;

namespace Sathus.Forms.Domain.ValueObjects;

/// <summary>
/// A condition that determines whether a field/section is shown to the respondent. Rules may
/// be nested with an <see cref="ConditionOperator"/> combinator to support complex visibility.
/// </summary>
public sealed class VisibilityCondition
{
    public string Field { get; set; } = string.Empty;

    public OperatorType Operator { get; set; } = OperatorType.Equals;

    public string? Value { get; set; }

    public ConditionOperator Combinator { get; set; } = ConditionOperator.And;

    public IReadOnlyList<VisibilityCondition>? Children { get; set; }

    public VisibilityCondition()
    {
    }

    public VisibilityCondition(string field, OperatorType op, string? value)
    {
        Field = field;
        Operator = op;
        Value = value;
    }
}
