using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchPermissionScope
{
    public PermissionScope Scope { get; private set; }
    public string? RequiredRoles { get; private set; }
    public string? AllowedUsers { get; private set; }

    public SearchPermissionScope(PermissionScope scope, string? requiredRoles = null, string? allowedUsers = null)
    {
        Scope = scope;
        RequiredRoles = requiredRoles;
        AllowedUsers = allowedUsers;
    }

    public static SearchPermissionScope Create(PermissionScope scope, string? requiredRoles = null, string? allowedUsers = null)
        => new(scope, requiredRoles, allowedUsers);

    public bool IsVisibleTo(string? userId, IEnumerable<string>? userRoles)
    {
        return Scope switch
        {
            PermissionScope.Public => true,
            PermissionScope.Authenticated => !string.IsNullOrEmpty(userId),
            PermissionScope.RoleBased => userRoles is not null && RequiredRoles is not null && userRoles.Any(r => RequiredRoles.Split(',').Contains(r, StringComparer.OrdinalIgnoreCase)),
            PermissionScope.Private => AllowedUsers is not null && !string.IsNullOrEmpty(userId) && AllowedUsers.Split(',').Contains(userId, StringComparer.OrdinalIgnoreCase),
            _ => false
        };
    }
}
