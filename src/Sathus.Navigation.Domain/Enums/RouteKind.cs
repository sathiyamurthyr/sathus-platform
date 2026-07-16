namespace Sathus.Navigation.Domain.Enums;

/// <summary>
/// Classification of a navigation route for routing/alias/canonical handling.
/// </summary>
public enum RouteKind
{
    Internal = 0,
    External = 1,
    Dynamic = 2,
    Alias = 3,
    Canonical = 4
}
