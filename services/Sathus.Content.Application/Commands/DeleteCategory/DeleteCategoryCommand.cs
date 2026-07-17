using MediatR;

namespace Sathus.Content.Application.Commands.DeleteCategory;

public sealed record DeleteCategoryCommand(Guid CategoryId) : IRequest<Unit>;
