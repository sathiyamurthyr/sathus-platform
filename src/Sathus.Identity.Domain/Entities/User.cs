using System;
using System.Collections.Generic;
using Sathus.Identity.Domain.Enums;
using Sathus.Identity.Domain.Interfaces;

namespace Sathus.Identity.Domain.Entities;

public sealed class User : BaseEntity, IAggregateRoot
{
    public string Email { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public bool EmailConfirmed { get; private set; }
    public bool MFAEnabled { get; private set; }
    public string? MFASecret { get; private set; }
    public UserStatus Status { get; private set; }
    public AuthProvider AuthProvider { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public DateTime? LastLoginAt { get; private set; }

    public ICollection<UserRole> UserRoles { get; } = new List<UserRole>();
    public ICollection<RefreshToken> RefreshTokens { get; } = new List<RefreshToken>();
    public ICollection<UserSession> UserSessions { get; } = new List<UserSession>();
    public ICollection<PasswordHistory> PasswordHistory { get; } = new List<PasswordHistory>();
    public ICollection<LoginHistory> LoginHistory { get; } = new List<LoginHistory>();
    public ICollection<AuditLog> AuditLogs { get; } = new List<AuditLog>();

    public User(string email, string firstName, string lastName, string passwordHash, AuthProvider authProvider)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentException.ThrowIfNullOrWhiteSpace(passwordHash);

        if (email.Length > 256) throw new ArgumentException("Email exceeds maximum length of 256.", nameof(email));
        if (firstName.Length > 128) throw new ArgumentException("First name exceeds maximum length of 128.", nameof(firstName));
        if (lastName.Length > 128) throw new ArgumentException("Last name exceeds maximum length of 128.", nameof(lastName));

        Id = Guid.NewGuid();
        Email = email;
        FirstName = firstName;
        LastName = lastName;
        PasswordHash = passwordHash;
        AuthProvider = authProvider;
        Status = UserStatus.Active;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangePassword(string newPasswordHash, DateTime changedAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(newPasswordHash);
        if (changedAt < CreatedAt) throw new ArgumentOutOfRangeException(nameof(changedAt));

        PasswordHash = newPasswordHash;
        UpdatedAt = changedAt;
    }

    public void EnableMFA(string secret)
    {
        if (string.IsNullOrWhiteSpace(secret)) throw new ArgumentException("MFA secret cannot be empty.", nameof(secret));

        MFASecret = secret;
        MFAEnabled = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DisableMFA()
    {
        MFASecret = null;
        MFAEnabled = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateProfile(string firstName, string lastName, DateTime updatedAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        if (firstName.Length > 128) throw new ArgumentException("First name exceeds maximum length of 128.", nameof(firstName));
        if (lastName.Length > 128) throw new ArgumentException("Last name exceeds maximum length of 128.", nameof(lastName));

        FirstName = firstName;
        LastName = lastName;
        UpdatedAt = updatedAt;
    }

    public void RecordLogin(DateTime loginAt)
    {
        if (loginAt < CreatedAt) throw new ArgumentOutOfRangeException(nameof(loginAt));

        LastLoginAt = loginAt;
        UpdatedAt = loginAt;
    }

    public void Suspend(DateTime updatedAt) => SetStatus(UserStatus.Suspended, updatedAt);
    public void Reactivate(DateTime updatedAt) => SetStatus(UserStatus.Active, updatedAt);
    public void MarkAsPending(DateTime updatedAt) => SetStatus(UserStatus.Pending, updatedAt);

    private void SetStatus(UserStatus status, DateTime updatedAt)
    {
        Status = status;
        UpdatedAt = updatedAt;
    }
}
