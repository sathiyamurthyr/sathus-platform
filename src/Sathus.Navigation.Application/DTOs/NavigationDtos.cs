using System.Collections.Generic;
using Sathus.Navigation.Domain.Entities;

namespace Sathus.Navigation.Application.DTOs;

public sealed record LocalizationDto(string LanguageCode, string DisplayName, string? RoutePath, bool IsFallback);

public sealed record PermissionDto(string Permission, string? Role, string Requirement, string Effect);

public sealed record VisibilityRuleDto(string RuleType, string Value, string Effect);

public sealed record NavigationNodeDto(
    Guid Id,
    Guid? ParentId,
    string DisplayName,
    string ItemType,
    string? RoutePath,
    string TargetType,
    string? TargetUrl,
    string ReferenceKind,
    Guid? ReferenceId,
    string? Icon,
    string? CssClass,
    bool IsExpanded,
    bool IsHidden,
    bool IsEnabled,
    int SortOrder,
    int Depth,
    IReadOnlyList<LocalizationDto> Localizations,
    IReadOnlyList<PermissionDto> Permissions,
    IReadOnlyList<VisibilityRuleDto> VisibilityRules,
    IReadOnlyList<NavigationNodeDto> Children)
{
    public static NavigationNodeDto From(NavigationNode node) => new(
        node.Id,
        node.ParentId,
        node.DisplayName,
        node.ItemType.ToString(),
        node.RoutePath,
        node.TargetType.ToString(),
        node.TargetUrl,
        node.ReferenceKind.ToString(),
        node.ReferenceId,
        node.Icon,
        node.CssClass,
        node.IsExpanded,
        node.IsHidden,
        node.IsEnabled,
        node.SortOrder,
        node.Depth,
        node.Localizations.Select(l => new LocalizationDto(l.LanguageCode, l.DisplayName, l.RoutePath, l.IsFallback)).ToList(),
        node.Permissions.Select(p => new PermissionDto(p.Permission, p.Role, p.Requirement.ToString(), p.Effect.ToString())).ToList(),
        node.VisibilityRules.Select(r => new VisibilityRuleDto(r.RuleType.ToString(), r.Value, r.Effect.ToString())).ToList(),
        node.Children.OrderBy(c => c.SortOrder).Select(From).ToList());
}

public sealed record NavigationItemDto(
    Guid Id,
    Guid NodeId,
    Guid? ParentItemId,
    string DisplayName,
    string? RoutePath,
    string? TargetUrl,
    string TargetType,
    string ItemType,
    string ReferenceKind,
    Guid? ReferenceId,
    int SortOrder,
    int Depth,
    string Locale,
    string? Icon,
    string? CssClass,
    bool IsHidden,
    bool IsEnabled,
    IReadOnlyList<VisibilityRuleDto> VisibilityRules,
    IReadOnlyList<PermissionDto> Permissions)
{
    public static NavigationItemDto From(NavigationItem item) => new(
        item.Id,
        item.NodeId,
        item.ParentItemId,
        item.DisplayName,
        item.RoutePath,
        item.TargetUrl,
        item.TargetType.ToString(),
        item.ItemType.ToString(),
        item.ReferenceKind.ToString(),
        item.ReferenceId,
        item.SortOrder,
        item.Depth,
        item.Locale,
        item.Icon,
        item.CssClass,
        item.IsHidden,
        item.IsEnabled,
        System.Text.Json.JsonSerializer.Deserialize<List<VisibilityRuleDto>>(item.VisibilityRulesJson) ?? new(),
        System.Text.Json.JsonSerializer.Deserialize<List<PermissionDto>>(item.RequiredPermissionsJson) ?? new());
}

public sealed record MenuSummaryDto(
    Guid Id,
    string Name,
    string MenuType,
    string Locale,
    string Status,
    int NodeCount,
    Guid? PublishedVersionId,
    DateTime? ScheduledPublishAt);

public sealed record TreeSummaryDto(
    Guid Id,
    string Platform,
    string Name,
    string DefaultLocale,
    string? Description,
    string Status,
    IReadOnlyList<MenuSummaryDto> Menus)
{
    public static TreeSummaryDto From(NavigationTree tree, int? nodeCount = null) => new(
        tree.Id,
        tree.Platform.ToString(),
        tree.Name,
        tree.DefaultLocale,
        tree.Description,
        tree.Status.ToString(),
        tree.Menus.Select(m => new MenuSummaryDto(
            m.Id,
            m.Name,
            m.Type.Value,
            m.Locale,
            m.Status.ToString(),
            nodeCount ?? CountNodes(m),
            m.PublishedVersionId,
            m.ScheduledPublishAt)).ToList());

    internal static int CountNodes(NavigationMenu menu)
    {
        var count = 0;
        var stack = new Stack<NavigationNode>(menu.Nodes);
        while (stack.Count > 0)
        {
            var n = stack.Pop();
            count++;
            foreach (var c in n.Children) stack.Push(c);
        }
        return count;
    }
}

public sealed record MenuDetailDto(
    Guid Id,
    Guid TreeId,
    string Name,
    string MenuType,
    string Locale,
    string Status,
    Guid? PublishedVersionId,
    DateTime? ScheduledPublishAt,
    IReadOnlyList<NavigationNodeDto> Nodes)
{
    public static MenuDetailDto From(NavigationMenu menu) => new(
        menu.Id,
        menu.TreeId,
        menu.Name,
        menu.Type.Value,
        menu.Locale,
        menu.Status.ToString(),
        menu.PublishedVersionId,
        menu.ScheduledPublishAt,
        menu.Nodes.OrderBy(n => n.SortOrder).Select(NavigationNodeDto.From).ToList());
}

public sealed record VersionDto(Guid Id, int VersionNumber, string Label, string Status, Guid? CreatedBy, DateTime CreatedAt, DateTime? PublishedAt, DateTime? ScheduledAt, bool IsCurrent);

public sealed record HistoryDto(Guid Id, string Operation, Guid? MenuId, Guid? ActorId, string Payload, DateTime OccurredAt, Guid? VersionId);

public sealed record RedirectDto(Guid Id, Guid MenuId, string SourcePath, string TargetPath, int RedirectType, string Locale, int Priority, bool IsEnabled);

public sealed record SearchResultDto(
    Guid TreeId,
    Guid MenuId,
    Guid NodeId,
    string DisplayName,
    string? RoutePath,
    string MenuType,
    string ReferenceKind,
    Guid? ReferenceId);

public sealed record BrokenRouteDto(Guid Id, Guid MenuId, string RoutePath, string? TargetUrl, string ReferenceKind, Guid? ResolvedReferenceId);

public sealed record PublishResultDto(Guid MenuId, Guid VersionId, int ItemCount, DateTime PublishedAt);
