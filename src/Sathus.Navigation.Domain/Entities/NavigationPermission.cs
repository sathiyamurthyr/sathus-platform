using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Domain.Entities;

/// <summary>
/// A permission rule attached to a node. Integrated with the Sathus Permission Engine.
/// </summary>
public sealed class NavigationPermission
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public string Permission { get; init; } = string.Empty;

    public string? Role { get; init; }

    public RequirementMode Requirement { get; init; } = RequirementMode.Any;

    public PermissionEffect Effect { get; init; } = PermissionEffect.Allow;

    public static NavigationPermission Create(
        string permission,
        RequirementMode requirement = RequirementMode.Any,
        PermissionEffect effect = PermissionEffect.Allow,
        string? role = null)
    {
        if (string.IsNullOrWhiteSpace(permission) && string.IsNullOrWhiteSpace(role))
        {
            throw new ArgumentException("A permission or role is required.");
        }

        return new NavigationPermission
        {
            Permission = (permission ?? string.Empty).Trim(),
            Role = role?.Trim(),
            Requirement = requirement,
            Effect = effect
        };
    }
}
