namespace Sathus.Identity.Domain;

public static class Permissions
{
    public const string UsersRead = "users.read";
    public const string UsersWrite = "users.write";
    public const string UsersManage = "users.manage";

    public const string RolesRead = "roles.read";
    public const string RolesWrite = "roles.write";
    public const string RolesAssign = "roles.assign";

    public const string PermissionsRead = "permissions.read";
    public const string PermissionsWrite = "permissions.write";

    public static IReadOnlyList<string> All { get; } = new[]
    {
        UsersRead,
        UsersWrite,
        UsersManage,
        RolesRead,
        RolesWrite,
        RolesAssign,
        PermissionsRead,
        PermissionsWrite
    };
}
