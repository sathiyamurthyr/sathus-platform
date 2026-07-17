using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Domain.Entities;

/// <summary>
/// A routing record for a menu. Supports internal/external/dynamic routes, aliases, canonical
/// routes and automated broken-route detection. Always belongs to a menu.
/// </summary>
public sealed class NavigationRoute : Entity
{
    public Guid MenuId { get; private set; }

    public string RoutePath { get; private set; } = string.Empty;

    public Guid? NodeId { get; private set; }

    public string? TargetUrl { get; private set; }

    public RouteKind RouteKind { get; private set; }

    public string? CanonicalPath { get; private set; }

    public string AliasesJson { get; private set; } = "[]";

    public bool IsBroken { get; private set; }

    public Guid? ResolvedReferenceId { get; private set; }

    public ReferenceKind ReferenceKind { get; private set; }

    public DateTime? LastValidatedAt { get; private set; }

    private NavigationRoute()
    {
    }

    public static NavigationRoute Create(
        Guid menuId,
        string routePath,
        RouteKind routeKind,
        string? targetUrl = null,
        Guid? nodeId = null,
        string? canonicalPath = null,
        ReferenceKind referenceKind = ReferenceKind.None,
        Guid? resolvedReferenceId = null)
    {
        return new NavigationRoute
        {
            Id = Guid.NewGuid(),
            MenuId = menuId,
            RoutePath = routePath,
            RouteKind = routeKind,
            TargetUrl = targetUrl,
            NodeId = nodeId,
            CanonicalPath = canonicalPath,
            ReferenceKind = referenceKind,
            ResolvedReferenceId = resolvedReferenceId
        };
    }

    public void AddAlias(string alias)
    {
        var aliases = System.Text.Json.JsonSerializer.Deserialize<List<string>>(AliasesJson) ?? new List<string>();
        if (!aliases.Contains(alias))
        {
            aliases.Add(alias);
            AliasesJson = System.Text.Json.JsonSerializer.Serialize(aliases);
        }
    }

    public void SetCanonical(string? canonicalPath) => CanonicalPath = canonicalPath;

    public void MarkBroken(DateTime at)
    {
        IsBroken = true;
        LastValidatedAt = at;
    }

    public void MarkResolved(Guid? resolvedReferenceId, DateTime at)
    {
        IsBroken = false;
        ResolvedReferenceId = resolvedReferenceId;
        LastValidatedAt = at;
    }
}
