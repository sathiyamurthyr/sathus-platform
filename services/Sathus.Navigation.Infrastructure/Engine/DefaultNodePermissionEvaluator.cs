using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Infrastructure.Engine;

public sealed class DefaultNodePermissionEvaluator(IPermissionCatalog catalog) : INodePermissionEvaluator
{
    public async Task<bool> IsAuthorized(IEnumerable<NavigationPermission> rules, AuthorizationContext context, CancellationToken cancellationToken = default)
    {
        var list = rules.ToList();
        if (list.Count == 0)
        {
            return true;
        }

        if (!context.IsAuthenticated)
        {
            return false;
        }

        foreach (var rule in list)
        {
            if (rule.Effect == PermissionEffect.Deny)
            {
                if ((!string.IsNullOrWhiteSpace(rule.Permission) && context.Permissions.Contains(rule.Permission)) ||
                    (!string.IsNullOrWhiteSpace(rule.Role) && context.Roles.Contains(rule.Role)))
                {
                    return false;
                }
            }
        }

        var allowRules = list.Where(r => r.Effect == PermissionEffect.Allow).ToList();
        if (allowRules.Count == 0)
        {
            return true;
        }

        foreach (var rule in allowRules)
        {
            bool satisfied;
            if (!string.IsNullOrWhiteSpace(rule.Permission))
            {
                if (!await catalog.ExistsAsync(rule.Permission, cancellationToken))
                {
                    satisfied = false;
                }
                else
                {
                    satisfied = context.Permissions.Contains(rule.Permission);
                }
            }
            else if (!string.IsNullOrWhiteSpace(rule.Role))
            {
                satisfied = context.Roles.Contains(rule.Role);
            }
            else
            {
                satisfied = false;
            }

            if (satisfied && rule.Requirement == RequirementMode.Any)
            {
                return true;
            }

            if (!satisfied && rule.Requirement == RequirementMode.All)
            {
                return false;
            }
        }

        var anyModeRules = allowRules.Where(r => r.Requirement == RequirementMode.Any).ToList();
        if (anyModeRules.Count > 0)
        {
            return anyModeRules.Any(rule =>
            {
                if (!string.IsNullOrWhiteSpace(rule.Permission))
                {
                    return context.Permissions.Contains(rule.Permission);
                }

                if (!string.IsNullOrWhiteSpace(rule.Role))
                {
                    return context.Roles.Contains(rule.Role);
                }

                return false;
            });
        }

        bool allSatisfied = true;
        foreach (var rule in allowRules.Where(r => r.Requirement == RequirementMode.All))
        {
            bool satisfied;
            if (!string.IsNullOrWhiteSpace(rule.Permission))
            {
                if (!await catalog.ExistsAsync(rule.Permission, cancellationToken))
                {
                    satisfied = false;
                }
                else
                {
                    satisfied = context.Permissions.Contains(rule.Permission);
                }
            }
            else if (!string.IsNullOrWhiteSpace(rule.Role))
            {
                satisfied = context.Roles.Contains(rule.Role);
            }
            else
            {
                satisfied = false;
            }

            allSatisfied = allSatisfied && satisfied;
        }

        return allSatisfied;
    }
}
