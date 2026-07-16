using MediatR;
using Sathus.Content.Application.DTOs;

namespace Sathus.Content.Application.Commands.UpdateCategory;

public sealed record UpdateCategoryCommand(Guid CategoryId, string Name, string? Description = null)
    : IRequest<CategoryResponse>;
