namespace Sathus.Navigation.Domain.Enums;

/// <summary>
/// HTTP redirect semantics for a navigation redirect rule.
/// </summary>
public enum RedirectType
{
    Permanent = 301,
    Temporary = 302,
    Canonical = 308
}
