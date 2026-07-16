using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Application.DTOs;

public sealed record UserResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    UserStatus Status,
    IReadOnlyList<string> Roles);
