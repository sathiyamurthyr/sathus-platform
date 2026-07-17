using System;
using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Domain.Entities;

public sealed class LoginHistory : BaseEntity
{
    public Guid UserId { get; private set; }
    public string? IpAddress { get; private set; }
    public string? UserAgent { get; private set; }
    public LoginStatus Status { get; private set; }
    public string? FailureReason { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public User User { get; private set; } = null!;

    public LoginHistory(Guid userId, string? ipAddress, string? userAgent, LoginStatus status, string? failureReason)
    {
        if (userId == Guid.Empty) throw new ArgumentException("UserId is required.", nameof(userId));
        if (ipAddress is { Length: > 64 }) throw new ArgumentException("IpAddress exceeds maximum length of 64.", nameof(ipAddress));
        if (userAgent is { Length: > 512 }) throw new ArgumentException("UserAgent exceeds maximum length of 512.", nameof(userAgent));

        Id = Guid.NewGuid();
        UserId = userId;
        IpAddress = ipAddress;
        UserAgent = userAgent;
        Status = status;
        FailureReason = failureReason;
        CreatedAt = DateTime.UtcNow;
    }

    private LoginHistory() { }
}
