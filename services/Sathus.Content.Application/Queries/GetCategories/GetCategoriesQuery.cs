using MediatR;
using Sathus.Content.Application.DTOs;

namespace Sathus.Content.Application.Queries.GetCategories;

public sealed record GetCategoriesQuery : IRequest<IReadOnlyList<CategoryResponse>>;
