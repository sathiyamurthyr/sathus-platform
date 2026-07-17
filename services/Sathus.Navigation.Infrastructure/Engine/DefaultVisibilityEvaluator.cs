using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Domain.ValueObjects;

namespace Sathus.Navigation.Infrastructure.Engine;

public sealed class DefaultVisibilityEvaluator : IVisibilityEvaluator
{
    public bool IsVisible(IEnumerable<VisibilityRule> rules, NavigationContext context)
    {
        foreach (var rule in rules)
        {
            var match = rule.RuleType switch
            {
                VisibilityRuleType.Public => true,
                VisibilityRuleType.Authenticated => context.IsAuthenticated,
                VisibilityRuleType.Permission => context.Permissions.Contains(rule.Value),
                VisibilityRuleType.Role => context.Roles.Contains(rule.Value),
                VisibilityRuleType.FeatureFlag => context.FeatureFlags.Contains(rule.Value),
                VisibilityRuleType.Country => context.Country is not null && context.Country.Equals(rule.Value, StringComparison.OrdinalIgnoreCase),
                VisibilityRuleType.Language => context.Language is not null && context.Language.Equals(rule.Value, StringComparison.OrdinalIgnoreCase),
                VisibilityRuleType.Device => context.Device is not null && context.Device.Equals(rule.Value, StringComparison.OrdinalIgnoreCase),
                _ => true
            };

            if (match && rule.Effect == VisibilityEffect.Show)
            {
                return true;
            }

            if (!match && rule.Effect == VisibilityEffect.Hide)
            {
                return true;
            }
        }

        return rules.Any() && rules.All(r => r.Effect == VisibilityEffect.Show) ? false : true;
    }

    public IReadOnlyList<NavigationNode> FilterVisible(IEnumerable<NavigationNode> nodes, NavigationContext context)
    {
        var list = nodes.ToList();
        foreach (var node in list)
        {
            if (!IsVisible(node.VisibilityRules, context))
            {
                list.Remove(node);
            }
        }

        return list;
    }
}
