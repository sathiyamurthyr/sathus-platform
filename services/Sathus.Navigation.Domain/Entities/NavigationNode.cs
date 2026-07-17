using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Domain.ValueObjects;

namespace Sathus.Navigation.Domain.Entities;

/// <summary>
/// A vertex in a navigation menu tree. Supports unlimited nesting via <see cref="Children"/>,
/// localization, visibility rules and permission gating. Behaves as an aggregate-adjacent
/// entity owned by a <see cref="NavigationMenu"/>.
/// </summary>
public sealed class NavigationNode : Entity
{
    public Guid MenuId { get; private set; }

    public Guid? ParentId { get; private set; }

    public NavigationNode? Parent { get; private set; }

    public ICollection<NavigationNode> Children { get; } = new List<NavigationNode>();

    public int SortOrder { get; private set; }

    public int Depth { get; private set; }

    public ItemType ItemType { get; private set; }

    public string DisplayName { get; private set; } = string.Empty;

    public string? RoutePath { get; private set; }

    public TargetType TargetType { get; private set; }

    public string? TargetUrl { get; private set; }

    public ReferenceKind ReferenceKind { get; private set; }

    public Guid? ReferenceId { get; private set; }

    public string? Icon { get; private set; }

    public string? CssClass { get; private set; }

    public bool IsExpanded { get; private set; }

    public bool IsHidden { get; private set; }

    public bool IsEnabled { get; private set; } = true;

    public ICollection<NavigationLocalization> Localizations { get; } = new List<NavigationLocalization>();

    public ICollection<NavigationPermission> Permissions { get; } = new List<NavigationPermission>();

    public ICollection<VisibilityRule> VisibilityRules { get; } = new List<VisibilityRule>();

    public NodeId NodeId => new(Id);

    private NavigationNode()
    {
    }

    public static NavigationNode Create(
        Guid menuId,
        Guid? parentId,
        int sortOrder,
        int depth,
        string displayName,
        ItemType itemType,
        string? routePath = null,
        TargetType targetType = TargetType.Internal,
        string? targetUrl = null,
        ReferenceKind referenceKind = ReferenceKind.None,
        Guid? referenceId = null,
        string? icon = null,
        string? cssClass = null,
        bool isExpanded = false,
        bool isHidden = false,
        bool isEnabled = true,
        Guid? createdBy = null)
    {
        var node = new NavigationNode
        {
            Id = Guid.NewGuid(),
            MenuId = menuId,
            ParentId = parentId,
            SortOrder = ValueObjects.SortOrder.Create(sortOrder),
            Depth = ValueObjects.NavigationDepth.Create(depth),
            ItemType = itemType,
            DisplayName = ValueObjects.DisplayName.Create(displayName).Value,
            RoutePath = routePath is null ? null : ValueObjects.RoutePath.Create(routePath).Value,
            TargetType = targetType,
            TargetUrl = targetUrl,
            ReferenceKind = referenceKind,
            ReferenceId = referenceId,
            Icon = icon,
            CssClass = cssClass,
            IsExpanded = isExpanded,
            IsHidden = isHidden,
            IsEnabled = isEnabled
        };

        node.SetCreationAudit(createdBy, DateTime.UtcNow);
        node.VisibilityRules.Add(VisibilityRule.Public());
        return node;
    }

    public void Update(
        string displayName,
        ItemType itemType,
        string? routePath,
        TargetType targetType,
        string? targetUrl,
        ReferenceKind referenceKind,
        Guid? referenceId,
        string? icon,
        string? cssClass,
        bool isExpanded,
        bool isHidden,
        bool isEnabled,
        Guid? updatedBy)
    {
        DisplayName = ValueObjects.DisplayName.Create(displayName).Value;
        ItemType = itemType;
        RoutePath = routePath is null ? null : ValueObjects.RoutePath.Create(routePath).Value;
        TargetType = targetType;
        TargetUrl = targetUrl;
        ReferenceKind = referenceKind;
        ReferenceId = referenceId;
        Icon = icon;
        CssClass = cssClass;
        IsExpanded = isExpanded;
        IsHidden = isHidden;
        IsEnabled = isEnabled;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void SetParent(Guid? parentId, int sortOrder, int depth)
    {
        ParentId = parentId;
        SortOrder = ValueObjects.SortOrder.Create(sortOrder);
        Depth = ValueObjects.NavigationDepth.Create(depth);
    }

    public void SetSortOrder(int sortOrder) => SortOrder = ValueObjects.SortOrder.Create(sortOrder);

    public void Reparent(NavigationNode? newParent, int sortOrder, int depth)
    {
        Parent = newParent;
        ParentId = newParent?.Id;
        SortOrder = ValueObjects.SortOrder.Create(sortOrder);
        Depth = ValueObjects.NavigationDepth.Create(depth);
    }

    public void ReapplyDepth(int depth) => Depth = ValueObjects.NavigationDepth.Create(depth);

    public void SetExpanded(bool expanded) => IsExpanded = expanded;

    public void Hide() => IsHidden = true;

    public void Show() => IsHidden = false;

    public void Enable() => IsEnabled = true;

    public void Disable() => IsEnabled = false;

    public void SetDisplayName(string displayName) => DisplayName = ValueObjects.DisplayName.Create(displayName).Value;

    public void SetRoute(string? routePath) =>
        RoutePath = routePath is null ? null : ValueObjects.RoutePath.Create(routePath).Value;

    public void AddLocalization(NavigationLocalization localization) =>
        Localizations.Add(localization ?? throw new ArgumentNullException(nameof(localization)));

    public void AddPermission(NavigationPermission permission) =>
        Permissions.Add(permission ?? throw new ArgumentNullException(nameof(permission)));

    public void AddVisibilityRule(VisibilityRule rule) =>
        VisibilityRules.Add(rule ?? throw new ArgumentNullException(nameof(rule)));

    public void ClearVisibilityRules() => VisibilityRules.Clear();

    public void ClearPermissions() => Permissions.Clear();

    /// <summary>
    /// Returns all descendant node ids (excluding self). Used for circular-reference prevention.
    /// </summary>
    public IEnumerable<Guid> GetDescendantIds()
    {
        var stack = new Stack<NavigationNode>(Children);
        while (stack.Count > 0)
        {
            var current = stack.Pop();
            yield return current.Id;
            foreach (var child in current.Children)
            {
                stack.Push(child);
            }
        }
    }
}
