namespace Sathus.Navigation.Domain.Enums;

/// <summary>
/// Visibility rule categories. Extensible: unknown future rule types are stored verbatim
/// and evaluated by the pluggable rule engine.
/// </summary>
public enum VisibilityRuleType
{
    Public = 0,
    Authenticated = 1,
    Permission = 2,
    Role = 3,
    FeatureFlag = 4,
    Country = 5,
    Language = 6,
    Device = 7,
    Custom = 99
}
