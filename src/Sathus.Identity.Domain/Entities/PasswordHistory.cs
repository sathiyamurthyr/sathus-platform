using System;

namespace Sathus.Identity.Domain.Entities;

public sealed class PasswordHistory : BaseEntity
{
    public Guid UserId { get; private set; }
    public string PasswordHash { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }

    public User User { get; private set; } = null!;

    public PasswordHistory(Guid userId, string passwordHash)
    {
        if (userId == Guid.Empty) throw new ArgumentException("UserId is required.", nameof(userId));
        ArgumentException.ThrowIfNullOrWhiteSpace(passwordHash);

        Id = Guid.NewGuid();
        UserId = userId;
        PasswordHash = passwordHash;
        CreatedAt = DateTime.UtcNow;
    }

    private PasswordHistory() { }
}
