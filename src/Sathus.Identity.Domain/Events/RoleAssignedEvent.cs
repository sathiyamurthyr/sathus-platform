using System;

namespace Sathus.Identity.Domain.Events;

public sealed class RoleAssignedEvent : DomainEvent
{
    public Guid UserId { get; }
    public string RoleName { get; }

    public RoleAssignedEvent(Guid userId, string roleName)
    {
        if (userId == Guid.Empty) throw new ArgumentException("UserId is required.", nameof(userId));
        ArgumentException.ThrowIfNullOrWhiteSpace(roleName);

        UserId = userId;
        RoleName = roleName;
    }
}
