using System;

namespace Sathus.Identity.Domain.Entities;

public sealed class RolePermission : BaseEntity
{
    public Guid RoleId { get; private set; }
    public Guid PermissionId { get; private set; }

    public Role Role { get; private set; } = null!;
    public Permission Permission { get; private set; } = null!;

    public RolePermission(Guid roleId, Guid permissionId)
    {
        if (roleId == Guid.Empty) throw new ArgumentException("RoleId is required.", nameof(roleId));
        if (permissionId == Guid.Empty) throw new ArgumentException("PermissionId is required.", nameof(permissionId));

        Id = Guid.NewGuid();
        RoleId = roleId;
        PermissionId = permissionId;
    }

    private RolePermission() { }
}
