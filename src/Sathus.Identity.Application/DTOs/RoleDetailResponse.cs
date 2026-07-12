namespace Sathus.Identity.Application.DTOs;

public sealed record RoleDetailResponse(
    Guid Id,
    string Name,
    string? Description,
    IReadOnlyList<string> Permissions);
