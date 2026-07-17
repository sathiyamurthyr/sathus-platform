using MediatR;

namespace Sathus.Content.Application.Commands.DeleteContentItem;

public sealed record DeleteContentItemCommand(Guid ContentItemId) : IRequest<Unit>;
