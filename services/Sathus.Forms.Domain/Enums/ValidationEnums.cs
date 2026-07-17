namespace Sathus.Forms.Domain.Enums;

/// <summary>Validation rule kinds that can be attached to a field.</summary>
public enum ValidationRuleType
{
    Required = 0,
    MinLength = 1,
    MaxLength = 2,
    Min = 3,
    Max = 4,
    Pattern = 5,
    Email = 6,
    Url = 7,
    Custom = 8
}

/// <summary>Comparison operator used by validation and visibility rules.</summary>
public enum OperatorType
{
    Equals = 0,
    NotEquals = 1,
    Contains = 2,
    GreaterThan = 3,
    LessThan = 4,
    IsEmpty = 5,
    IsNotEmpty = 6,
    In = 7
}

/// <summary>Logical operator used to combine multiple conditions.</summary>
public enum ConditionOperator
{
    And = 0,
    Or = 1
}
