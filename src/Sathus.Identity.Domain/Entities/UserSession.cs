using System;

namespace Sathus.Identity.Domain.Entities;

public sealed class UserSession : BaseEntity
{
    public Guid UserId { get; private set; }
    public string? IpAddress { get; private set; }
    public string? UserAgent { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public DateTime? LastActivityAt { get; private set; }
    public DateTime? RevokedAt { get; private set; }

    public User User { get; private set; } = null!;

    public UserSession(Guid userId, string? ipAddress, string? userAgent, DateTime expiresAt)
    {
        if (userId == Guid.Empty) throw new ArgumentException("UserId is required.", nameof(userId));
        if (expiresAt <= DateTime.UtcNow) throw new ArgumentException("Expiration must be in the future.", nameof(expiresAt));
        if (ipAddress is { Length: > 64 }) throw new ArgumentException("IpAddress exceeds maximum length of 64.", nameof(ipAddress));
        if (userAgent is { Length: > 512 }) throw new ArgumentException("UserAgent exceeds maximum length of 512.", nameof(userAgent));

        Id = Guid.NewGuid();
        UserId = userId;
        IpAddress = ipAddress;
        UserAgent = userAgent;
        CreatedAt = DateTime.UtcNow;
        ExpiresAt = expiresAt;
    }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => RevokedAt is null && !IsExpired;

    public void RecordActivity(DateTime activityAt)
    {
        LastActivityAt = activityAt;
    }

    public void Revoke(DateTime revokedAt)
    {
        if (RevokedAt is not null) throw new InvalidOperationException("Session is already revoked.");
        if (revokedAt < CreatedAt) throw new ArgumentOutOfRangeException(nameof(revokedAt));

        RevokedAt = revokedAt;
    }
}
