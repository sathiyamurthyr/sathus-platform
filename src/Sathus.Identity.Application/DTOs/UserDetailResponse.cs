using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Application.DTOs;

public sealed record UserDetailResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    UserStatus Status,
    bool EmailConfirmed,
    bool MFAEnabled,
    DateTime CreatedAt,
    DateTime? LastLoginAt,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions);
