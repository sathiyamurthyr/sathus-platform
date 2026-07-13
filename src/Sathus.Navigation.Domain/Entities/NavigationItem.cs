using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Domain.Entities;

/// <summary>
/// A flattened, read-optimized menu item produced when a version is published. Powers virtual
/// tree rendering, lazy loading and the public navigation API.
/// </summary>
public sealed class NavigationItem : Entity
{
    public Guid MenuId { get; private set; }

    public Guid VersionId { get; private set; }

    public Guid NodeId { get; private set; }

    public Guid? ParentItemId { get; private set; }

    public string DisplayName { get; private set; } = string.Empty;

    public string? RoutePath { get; private set; }

    public string? TargetUrl { get; private set; }

    public TargetType TargetType { get; private set; }

    public ItemType ItemType { get; private set; }

    public ReferenceKind ReferenceKind { get; private set; }

    public Guid? ReferenceId { get; private set; }

    public int SortOrder { get; private set; }

    public int Depth { get; private set; }

    public string Locale { get; private set; } = "en";

    public string? Icon { get; private set; }

    public string? CssClass { get; private set; }

    public bool IsHidden { get; private set; }

    public bool IsEnabled { get; private set; }

    /// <summary>Serialized visibility rules (JSON) for the rule engine.</summary>
    public string VisibilityRulesJson { get; private set; } = "[]";

    /// <summary>Serialized required permissions (JSON) for the permission engine.</summary>
    public string RequiredPermissionsJson { get; private set; } = "[]";

    private NavigationItem()
    {
    }

    public static NavigationItem Create(
        Guid menuId,
        Guid versionId,
        Guid nodeId,
        Guid? parentItemId,
        string displayName,
        string? routePath,
        string? targetUrl,
        TargetType targetType,
        ItemType itemType,
        ReferenceKind referenceKind,
        Guid? referenceId,
        int sortOrder,
        int depth,
        string locale,
        string? icon,
        string? cssClass,
        bool isHidden,
        bool isEnabled,
        string visibilityRulesJson,
        string requiredPermissionsJson)
    {
        return new NavigationItem
        {
            Id = Guid.NewGuid(),
            MenuId = menuId,
            VersionId = versionId,
            NodeId = nodeId,
            ParentItemId = parentItemId,
            DisplayName = displayName,
            RoutePath = routePath,
            TargetUrl = targetUrl,
            TargetType = targetType,
            ItemType = itemType,
            ReferenceKind = referenceKind,
            ReferenceId = referenceId,
            SortOrder = sortOrder,
            Depth = depth,
            Locale = locale,
            Icon = icon,
            CssClass = cssClass,
            IsHidden = isHidden,
            IsEnabled = isEnabled,
            VisibilityRulesJson = visibilityRulesJson,
            RequiredPermissionsJson = requiredPermissionsJson
        };
    }
}
