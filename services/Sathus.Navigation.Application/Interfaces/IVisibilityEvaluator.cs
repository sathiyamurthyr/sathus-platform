using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.ValueObjects;

namespace Sathus.Navigation.Application.Interfaces;

/// <summary>
/// Runtime context used to evaluate node visibility and permission rules.
/// </summary>
public sealed class NavigationContext
{
    public bool IsAuthenticated { get; init; }

    public IReadOnlySet<string> Permissions { get; init; } = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

    public IReadOnlySet<string> Roles { get; init; } = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

    public IReadOnlySet<string> FeatureFlags { get; init; } = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

    public string? Country { get; init; }

    public string? Language { get; init; }

    public string? Device { get; init; }
}

/// <summary>
/// Evaluates <see cref="VisibilityRule"/> sets against a <see cref="NavigationContext"/>.
/// This is the pluggable rule engine; unknown rule types fall back to "show".
/// </summary>
public interface IVisibilityEvaluator
{
    bool IsVisible(IEnumerable<VisibilityRule> rules, NavigationContext context);

    IReadOnlyList<NavigationNode> FilterVisible(IEnumerable<NavigationNode> nodes, NavigationContext context);
}
