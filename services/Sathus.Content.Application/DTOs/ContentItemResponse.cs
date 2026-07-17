using Sathus.Content.Domain.Enums;

namespace Sathus.Content.Application.DTOs;

public sealed record ContentItemResponse(
    Guid Id,
    string Title,
    string Slug,
    string? Description,
    ContentType ContentType,
    ContentStatus Status,
    DateTime? PublishedAt,
    Guid? AuthorId,
    DateTime CreatedAt,
    DateTime UpdatedAt);
