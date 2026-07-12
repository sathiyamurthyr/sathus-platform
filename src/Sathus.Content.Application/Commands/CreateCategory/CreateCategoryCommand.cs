using MediatR;
using Sathus.Content.Application.DTOs;

namespace Sathus.Content.Application.Commands.CreateCategory;

public sealed record CreateCategoryCommand(string Name, string Slug, string? Description = null)
    : IRequest<CategoryResponse>;
