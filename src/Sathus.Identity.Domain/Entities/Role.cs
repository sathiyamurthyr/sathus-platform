using System;
using System.Collections.Generic;

namespace Sathus.Identity.Domain.Entities;

public sealed class Role : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public ICollection<UserRole> UserRoles { get; } = new List<UserRole>();
    public ICollection<RolePermission> RolePermissions { get; } = new List<RolePermission>();

    public Role(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        if (name.Length > 64) throw new ArgumentException("Role name exceeds maximum length of 64.", nameof(name));

        Id = Guid.NewGuid();
        Name = name;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetDescription(string? description, DateTime updatedAt)
    {
        Description = description;
        UpdatedAt = updatedAt;
    }

    public void Rename(string name, DateTime updatedAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        if (name.Length > 64) throw new ArgumentException("Role name exceeds maximum length of 64.", nameof(name));

        Name = name;
        UpdatedAt = updatedAt;
    }
}
