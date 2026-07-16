using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Application.DTOs;

public sealed record UserSummary(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    UserStatus Status,
    IReadOnlyList<string> Roles);
