namespace Sathus.Content.Application.DTOs;

public sealed record CategoryResponse(Guid Id, string Name, string Slug, string? Description);
