namespace Sathus.Navigation.Domain.Enums;

/// <summary>
/// Whether a set of permissions must be satisfied individually (Any) or collectively (All).
/// </summary>
public enum RequirementMode
{
    Any = 0,
    All = 1
}
