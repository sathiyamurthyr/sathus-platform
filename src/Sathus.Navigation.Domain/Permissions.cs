namespace Sathus.Navigation.Domain;

/// <summary>
/// Claims-based permissions for the navigation bounded context. Built into authorization
/// policies; never reference roles directly.
/// </summary>
public static class NavigationPermissions
{
    public const string Read = "navigation.read";
    public const string Create = "navigation.create";
    public const string Update = "navigation.update";
    public const string Publish = "navigation.publish";
    public const string Delete = "navigation.delete";
    public const string Rollback = "navigation.rollback";

    public static IReadOnlyList<string> All { get; } = new[]
    {
        Read,
        Create,
        Update,
        Publish,
        Delete,
        Rollback
    };
}
