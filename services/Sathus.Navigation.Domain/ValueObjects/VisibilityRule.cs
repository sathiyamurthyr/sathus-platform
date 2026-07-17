using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Domain.ValueObjects;

/// <summary>
/// A single visibility rule attached to a node. Rules are evaluated by the permission/rule
/// engine; unknown rule types are preserved for the pluggable future rule engine.
/// </summary>
public sealed class VisibilityRule
{
    public VisibilityRuleType RuleType { get; }

    public string Value { get; }

    public VisibilityEffect Effect { get; }

    private VisibilityRule(VisibilityRuleType ruleType, string value, VisibilityEffect effect)
    {
        RuleType = ruleType;
        Value = value;
        Effect = effect;
    }

    public static VisibilityRule Create(VisibilityRuleType ruleType, string? value, VisibilityEffect effect = VisibilityEffect.Show)
    {
        var normalized = (value ?? string.Empty).Trim();
        if (ruleType is VisibilityRuleType.Permission or VisibilityRuleType.Role or VisibilityRuleType.FeatureFlag
            or VisibilityRuleType.Country or VisibilityRuleType.Language or VisibilityRuleType.Device or VisibilityRuleType.Custom
            && string.IsNullOrWhiteSpace(normalized))
        {
            throw new ArgumentException($"A value is required for visibility rule '{ruleType}'.", nameof(value));
        }

        return new VisibilityRule(ruleType, normalized, effect);
    }

    public static VisibilityRule Public() => new(VisibilityRuleType.Public, string.Empty, VisibilityEffect.Show);

    public static VisibilityRule Authenticated() => new(VisibilityRuleType.Authenticated, string.Empty, VisibilityEffect.Show);

    public override bool Equals(object? obj) =>
        obj is VisibilityRule other && other.RuleType == RuleType && other.Value == Value && other.Effect == Effect;

    public override int GetHashCode() => HashCode.Combine(RuleType, Value, Effect);
}
