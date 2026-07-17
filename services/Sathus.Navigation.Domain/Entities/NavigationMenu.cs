using System.Text.Json;
using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Domain.Events;
using Sathus.Navigation.Domain.Exceptions;
using Sathus.Navigation.Domain.ValueObjects;

namespace Sathus.Navigation.Domain.Entities;

/// <summary>
/// A named navigation menu (a slot such as Main, Footer or Sidebar) within a
/// <see cref="NavigationTree"/>. Owns its node tree, versions and published items.
/// Encapsulates the full navigation lifecycle: create/edit/delete/move/copy/clone,
/// version/publish/schedule/rollback.
/// </summary>
public sealed class NavigationMenu : AggregateRoot
{
    public Guid TreeId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string MenuTypeValue { get; private set; } = "main";

    public string Locale { get; private set; } = "en";

    public MenuStatus Status { get; private set; } = MenuStatus.Draft;

    public Guid? CurrentVersionId { get; private set; }

    public Guid? PublishedVersionId { get; private set; }

    public DateTime? ScheduledPublishAt { get; private set; }

    public int VersionCounter { get; private set; }

    public ICollection<NavigationNode> Nodes { get; } = new List<NavigationNode>();

    public ICollection<NavigationVersion> Versions { get; } = new List<NavigationVersion>();

    public ICollection<NavigationItem> Items { get; } = new List<NavigationItem>();

    public ICollection<NavigationRoute> Routes { get; } = new List<NavigationRoute>();

    public ICollection<NavigationLocalization> Localizations { get; } = new List<NavigationLocalization>();

    public MenuId MenuId => new(Id);

    public MenuType Type => MenuType.Create(MenuTypeValue);

    private NavigationMenu()
    {
    }

    public static NavigationMenu Create(
        Guid treeId,
        string name,
        MenuType menuType,
        string locale,
        Guid? createdBy = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Menu name is required.", nameof(name));
        }

        return new NavigationMenu
        {
            Id = Guid.NewGuid(),
            TreeId = treeId,
            Name = name.Trim(),
            MenuTypeValue = menuType.Value,
            Locale = (locale ?? "en").ToLowerInvariant(),
            Status = MenuStatus.Draft,
            VersionCounter = 0
        };
    }

    public void Rename(string name, Guid? updatedBy)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Menu name is required.", nameof(name));
        }

        Name = name.Trim();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public NavigationNode CreateNode(
        Guid? parentId,
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
        NavigationNode? parent = parentId is null ? null : FindNode(parentId.Value)
            ?? throw new NavigationNodeNotFoundException(parentId.Value);

        var depth = parent is null ? 0 : parent.Depth + 1;
        var siblings = parent?.Children ?? Nodes;
        var order = siblings.Count == 0 ? 0 : siblings.Max(n => n.SortOrder) + 1;

        var node = NavigationNode.Create(
            Id, parentId, order, depth, displayName, itemType, routePath, targetType,
            targetUrl, referenceKind, referenceId, icon, cssClass, isExpanded, isHidden, isEnabled, createdBy);

        if (parent is null)
        {
            Nodes.Add(node);
        }
        else
        {
            parent.Children.Add(node);
        }

        AddDomainEvent(new NavigationNodeCreatedEvent(Id, node.Id));
        return node;
    }

    public void UpdateNode(
        Guid nodeId,
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
        var node = FindNode(nodeId) ?? throw new NavigationNodeNotFoundException(nodeId);
        node.Update(displayName, itemType, routePath, targetType, targetUrl, referenceKind,
            referenceId, icon, cssClass, isExpanded, isHidden, isEnabled, updatedBy);
    }

    public void MoveNode(Guid nodeId, Guid? newParentId, int newOrder)
    {
        var node = FindNode(nodeId) ?? throw new NavigationNodeNotFoundException(nodeId);

        if (newParentId == nodeId)
        {
            throw new NavigationCircularReferenceException("A node cannot be its own parent.");
        }

        if (newParentId is not null)
        {
            var newParent = FindNode(newParentId.Value)
                ?? throw new NavigationNodeNotFoundException(newParentId.Value);

            if (node.GetDescendantIds().Contains(newParentId.Value))
            {
                throw new NavigationCircularReferenceException(
                    "Moving a node under one of its own descendants would create a cycle.");
            }
        }

        Detach(node);
        node.Reparent(newParentId is null ? null : FindNode(newParentId.Value), newOrder, newParentId is null ? 0 : FindNode(newParentId.Value)!.Depth + 1);

        if (newParentId is null)
        {
            Nodes.Add(node);
        }
        else
        {
            FindNode(newParentId.Value)!.Children.Add(node);
        }

        ReindexSubtree(node);
        AddDomainEvent(new NavigationNodeMovedEvent(Id, nodeId, newParentId, newOrder));
    }

    public Guid CopyNode(Guid nodeId, Guid? newParentId)
    {
        var source = FindNode(nodeId) ?? throw new NavigationNodeNotFoundException(nodeId);

        if (newParentId is not null)
        {
            var parent = FindNode(newParentId.Value)
                ?? throw new NavigationNodeNotFoundException(newParentId.Value);
            if (source.GetDescendantIds().Contains(newParentId.Value))
            {
                throw new NavigationCircularReferenceException("Cannot copy a node into its own subtree.");
            }
        }

        var parentDepth = newParentId is null ? -1 : FindNode(newParentId.Value)!.Depth;
        var copy = CloneSubtree(source, newParentId, parentDepth + 1, Id);
        if (newParentId is null)
        {
            Nodes.Add(copy);
        }
        else
        {
            FindNode(newParentId.Value)!.Children.Add(copy);
        }

        return copy.Id;
    }

    public void DeleteNode(Guid nodeId)
    {
        var node = FindNode(nodeId) ?? throw new NavigationNodeNotFoundException(nodeId);
        Detach(node);
    }

    public void Archive(Guid? actorId)
    {
        if (Status == MenuStatus.Archived)
        {
            return;
        }

        Status = MenuStatus.Archived;
        SetUpdateAudit(actorId, DateTime.UtcNow);
        AddDomainEvent(new NavigationMenuArchivedEvent(Id));
    }

    public void Restore(Guid? actorId)
    {
        if (Status != MenuStatus.Archived)
        {
            return;
        }

        Status = PublishedVersionId.HasValue ? MenuStatus.Published : MenuStatus.Draft;
        SetUpdateAudit(actorId, DateTime.UtcNow);
    }

    public NavigationVersion CreateVersion(string label, Guid? actorId)
    {
        var snapshot = BuildSnapshot();
        var version = NavigationVersion.Create(Id, ++VersionCounter, label, snapshot, actorId);
        Versions.Add(version);
        CurrentVersionId = version.Id;

        foreach (var existing in Versions)
        {
            existing.MarkCurrent(existing.Id == version.Id);
        }

        return version;
    }

    public void Publish(Guid versionId, Guid? actorId)
    {
        var version = Versions.FirstOrDefault(v => v.Id == versionId)
            ?? throw new NavigationVersionNotFoundException(versionId);

        version.MarkPublished(DateTime.UtcNow);
        version.MarkCurrent(true);
        foreach (var other in Versions.Where(v => v.Id != version.Id))
        {
            other.MarkCurrent(false);
        }

        Status = MenuStatus.Published;
        CurrentVersionId = version.Id;
        PublishedVersionId = version.Id;
        ScheduledPublishAt = null;
        SetUpdateAudit(actorId, DateTime.UtcNow);

        RegenerateItems(version);

        AddDomainEvent(new NavigationMenuPublishedEvent(TreeId, Id, version.Id));
    }

    public void SchedulePublish(Guid versionId, DateTime scheduledAt, Guid? actorId)
    {
        var version = Versions.FirstOrDefault(v => v.Id == versionId)
            ?? throw new NavigationVersionNotFoundException(versionId);

        if (scheduledAt <= DateTime.UtcNow)
        {
            throw new NavigationInvalidOperationException("Scheduled publish time must be in the future.");
        }

        version.MarkScheduled(scheduledAt);
        Status = MenuStatus.Scheduled;
        ScheduledPublishAt = scheduledAt;
        CurrentVersionId = version.Id;
        SetUpdateAudit(actorId, DateTime.UtcNow);

        AddDomainEvent(new NavigationMenuScheduledEvent(Id, version.Id, scheduledAt));
    }

    public NavigationVersion Rollback(Guid toVersionId, Guid? actorId)
    {
        var target = Versions.FirstOrDefault(v => v.Id == toVersionId)
            ?? throw new NavigationVersionNotFoundException(toVersionId);

        if (PublishedVersionId is null)
        {
            throw new NavigationInvalidOperationException("Cannot rollback a menu that has never been published.");
        }

        RebuildFromSnapshot(target.Snapshot);

        foreach (var version in Versions)
        {
            version.MarkCurrent(false);
        }

        target.MarkCurrent(true);
        target.MarkPublished(DateTime.UtcNow);
        CurrentVersionId = target.Id;
        PublishedVersionId = target.Id;
        Status = MenuStatus.Published;
        ScheduledPublishAt = null;
        SetUpdateAudit(actorId, DateTime.UtcNow);

        RegenerateItems(target);

        AddDomainEvent(new NavigationMenuRolledBackEvent(Id, PublishedVersionId ?? target.Id, target.Id));
        return target;
    }

    /// <summary>Produces the denormalized, published item list for a version snapshot.</summary>
    public IReadOnlyList<NavigationItem> RegenerateItems(NavigationVersion version)
    {
        Items.Clear();
        var built = BuildItems(version);
        foreach (var item in built)
        {
            Items.Add(item);
        }

        return built;
    }

    /// <summary>Builds the item list for a version without mutating persisted items (used for preview).</summary>
    public IReadOnlyList<NavigationItem> PreviewItems(Guid versionId)
    {
        var version = Versions.FirstOrDefault(v => v.Id == versionId)
            ?? throw new NavigationInvalidOperationException($"Version '{versionId}' was not found.");
        return BuildItems(version);
    }

    private List<NavigationItem> BuildItems(NavigationVersion version)
    {
        var built = new List<NavigationItem>();
        var itemByNode = new Dictionary<Guid, Guid>();
        TraverseForItems(Nodes.OrderBy(n => n.SortOrder).ToList(), null, version, built, itemByNode, 0);
        return built;
    }

    private void TraverseForItems(
        IReadOnlyList<NavigationNode> nodes,
        Guid? parentItemId,
        NavigationVersion version,
        List<NavigationItem> sink,
        Dictionary<Guid, Guid> itemByNode,
        int depth)
    {
        foreach (var node in nodes)
        {
            var item = NavigationItem.Create(
                Id, version.Id, node.Id, parentItemId, node.DisplayName, node.RoutePath,
                node.TargetUrl, node.TargetType, node.ItemType, node.ReferenceKind, node.ReferenceId,
                node.SortOrder, depth, Locale, node.Icon, node.CssClass, node.IsHidden, node.IsEnabled,
                JsonSerializer.Serialize(node.VisibilityRules), JsonSerializer.Serialize(node.Permissions));
            sink.Add(item);
            itemByNode[node.Id] = item.Id;
            TraverseForItems(node.Children.OrderBy(n => n.SortOrder).ToList(), item.Id, version, sink, itemByNode, depth + 1);
        }
    }

    public NavigationNode? FindNode(Guid nodeId)
    {
        var stack = new Stack<NavigationNode>(Nodes);
        while (stack.Count > 0)
        {
            var current = stack.Pop();
            if (current.Id == nodeId)
            {
                return current;
            }

            foreach (var child in current.Children)
            {
                stack.Push(child);
            }
        }

        return null;
    }

    private void Detach(NavigationNode node)
    {
        if (node.Parent is not null)
        {
            node.Parent.Children.Remove(node);
        }
        else
        {
            Nodes.Remove(node);
        }
    }

    private void ReindexSubtree(NavigationNode root)
    {
        var queue = new Queue<(NavigationNode node, int depth)>();
        queue.Enqueue((root, root.Depth));
        while (queue.Count > 0)
        {
            var (node, depth) = queue.Dequeue();
            node.ReapplyDepth(depth);
            var ordered = node.Children.OrderBy(c => c.SortOrder).ToList();
            for (var i = 0; i < ordered.Count; i++)
            {
                ordered[i].SetSortOrder(i);
                queue.Enqueue((ordered[i], depth + 1));
            }
        }
    }

    private NavigationNode CloneSubtree(NavigationNode source, Guid? parentId, int depth, Guid menuId)
    {
        var clone = NavigationNode.Create(
            menuId, parentId, source.SortOrder, depth, source.DisplayName, source.ItemType,
            source.RoutePath, source.TargetType, source.TargetUrl, source.ReferenceKind,
            source.ReferenceId, source.Icon, source.CssClass, source.IsExpanded, source.IsHidden,
            source.IsEnabled, source.CreatedBy);

        foreach (var localization in source.Localizations)
        {
            clone.AddLocalization(NavigationLocalization.Create(
                localization.LanguageCode, localization.DisplayName, localization.RoutePath, localization.IsFallback));
        }

        foreach (var permission in source.Permissions)
        {
            clone.AddPermission(NavigationPermission.Create(permission.Permission, permission.Requirement, permission.Effect, permission.Role));
        }

        foreach (var rule in source.VisibilityRules)
        {
            clone.AddVisibilityRule(VisibilityRule.Create(rule.RuleType, rule.Value, rule.Effect));
        }

        foreach (var child in source.Children.OrderBy(c => c.SortOrder))
        {
            clone.Children.Add(CloneSubtree(child, clone.Id, depth + 1, menuId));
        }

        return clone;
    }

    public string BuildSnapshot()
    {
        var flat = new List<SnapshotNode>();
        Flatten(Nodes.OrderBy(n => n.SortOrder).ToList(), null, flat);
        return JsonSerializer.Serialize(flat, new JsonSerializerOptions { WriteIndented = false });
    }

    private void Flatten(IReadOnlyList<NavigationNode> nodes, Guid? parentId, List<SnapshotNode> sink)
    {
        foreach (var node in nodes)
        {
            sink.Add(new SnapshotNode
            {
                Id = node.Id,
                ParentId = parentId,
                DisplayName = node.DisplayName,
                ItemType = node.ItemType,
                RoutePath = node.RoutePath,
                TargetType = node.TargetType,
                TargetUrl = node.TargetUrl,
                ReferenceKind = node.ReferenceKind,
                ReferenceId = node.ReferenceId,
                SortOrder = node.SortOrder,
                Depth = node.Depth,
                Icon = node.Icon,
                CssClass = node.CssClass,
                IsExpanded = node.IsExpanded,
                IsHidden = node.IsHidden,
                IsEnabled = node.IsEnabled,
                Localizations = node.Localizations.Select(l => new SnapshotLocalization(l.LanguageCode, l.DisplayName, l.RoutePath, l.IsFallback)).ToList(),
                Permissions = node.Permissions.Select(p => new SnapshotPermission(p.Permission, p.Role, (int)p.Requirement, (int)p.Effect)).ToList(),
                VisibilityRules = node.VisibilityRules.Select(r => new SnapshotVisibilityRule((int)r.RuleType, r.Value, (int)r.Effect)).ToList()
            });
            Flatten(node.Children.OrderBy(c => c.SortOrder).ToList(), node.Id, sink);
        }
    }

    public void RebuildFromSnapshot(string snapshot)
    {
        var flat = JsonSerializer.Deserialize<List<SnapshotNode>>(snapshot) ?? new List<SnapshotNode>();
        Nodes.Clear();
        var byId = new Dictionary<Guid, NavigationNode>();
        var created = flat.Select(s =>
        {
            var node = NavigationNode.Create(
                Id, s.ParentId, s.SortOrder, s.Depth, s.DisplayName, s.ItemType, s.RoutePath,
                s.TargetType, s.TargetUrl, s.ReferenceKind, s.ReferenceId, s.Icon, s.CssClass,
                s.IsExpanded, s.IsHidden, s.IsEnabled, null);
            foreach (var l in s.Localizations) node.AddLocalization(NavigationLocalization.Create(l.LanguageCode, l.DisplayName, l.RoutePath, l.IsFallback));
            foreach (var p in s.Permissions) node.AddPermission(NavigationPermission.Create(p.Permission, (RequirementMode)p.Requirement, (PermissionEffect)p.Effect, p.Role));
            foreach (var r in s.VisibilityRules) node.AddVisibilityRule(VisibilityRule.Create((VisibilityRuleType)r.RuleType, r.Value, (VisibilityEffect)r.Effect));
            byId[s.Id] = node;
            return s;
        }).ToList();

        foreach (var s in created)
        {
            var node = byId[s.Id];
            if (s.ParentId is null)
            {
                Nodes.Add(node);
            }
            else if (byId.TryGetValue(s.ParentId.Value, out var parent))
            {
                parent.Children.Add(node);
                node.Reparent(parent, node.SortOrder, parent.Depth + 1);
            }
            else
            {
                Nodes.Add(node);
            }
        }
    }

    private sealed class SnapshotNode
    {
        public Guid Id { get; set; }
        public Guid? ParentId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
        public ItemType ItemType { get; set; }
        public string? RoutePath { get; set; }
        public TargetType TargetType { get; set; }
        public string? TargetUrl { get; set; }
        public ReferenceKind ReferenceKind { get; set; }
        public Guid? ReferenceId { get; set; }
        public int SortOrder { get; set; }
        public int Depth { get; set; }
        public string? Icon { get; set; }
        public string? CssClass { get; set; }
        public bool IsExpanded { get; set; }
        public bool IsHidden { get; set; }
        public bool IsEnabled { get; set; }
        public List<SnapshotLocalization> Localizations { get; set; } = new();
        public List<SnapshotPermission> Permissions { get; set; } = new();
        public List<SnapshotVisibilityRule> VisibilityRules { get; set; } = new();
    }

    private sealed record SnapshotLocalization(string LanguageCode, string DisplayName, string? RoutePath, bool IsFallback);
    private sealed record SnapshotPermission(string Permission, string? Role, int Requirement, int Effect);
    private sealed record SnapshotVisibilityRule(int RuleType, string Value, int Effect);
}
