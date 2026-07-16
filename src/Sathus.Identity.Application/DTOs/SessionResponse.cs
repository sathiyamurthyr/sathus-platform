namespace Sathus.Identity.Application.DTOs;

public sealed record SessionResponse(
    Guid Id,
    string? IpAddress,
    string? UserAgent,
    DateTime CreatedAt,
    DateTime ExpiresAt,
    bool IsActive);
