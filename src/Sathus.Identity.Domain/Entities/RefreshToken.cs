using System;

namespace Sathus.Identity.Domain.Entities;

public sealed class RefreshToken : BaseEntity
{
    public string Token { get; private set; } = string.Empty;
    public Guid UserId { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? RevokedAt { get; private set; }
    public string? ReplacedByToken { get; private set; }

    public User User { get; private set; } = null!;

    public RefreshToken(string token, Guid userId, DateTime expiresAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(token);
        if (token.Length > 512) throw new ArgumentException("Token exceeds maximum length of 512.", nameof(token));
        if (userId == Guid.Empty) throw new ArgumentException("UserId is required.", nameof(userId));
        if (expiresAt <= DateTime.UtcNow) throw new ArgumentException("Expiration must be in the future.", nameof(expiresAt));

        Id = Guid.NewGuid();
        Token = token;
        UserId = userId;
        ExpiresAt = expiresAt;
        CreatedAt = DateTime.UtcNow;
    }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => RevokedAt is null && !IsExpired;

    public void Revoke(string? replacedByToken = null, DateTime? revokedAt = null)
    {
        if (RevokedAt is not null) throw new InvalidOperationException("Token is already revoked.");

        RevokedAt = revokedAt ?? DateTime.UtcNow;
        ReplacedByToken = replacedByToken;
    }
}
