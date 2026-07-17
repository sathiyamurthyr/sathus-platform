using System;
using System.Collections.Generic;

namespace Sathus.Identity.Domain.Entities;

public sealed class Permission : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public ICollection<RolePermission> RolePermissions { get; } = new List<RolePermission>();

    public Permission(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        if (name.Length > 128) throw new ArgumentException("Permission name exceeds maximum length of 128.", nameof(name));

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
}
