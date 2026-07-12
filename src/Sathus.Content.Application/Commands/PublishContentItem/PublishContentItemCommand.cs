using MediatR;

namespace Sathus.Content.Application.Commands.PublishContentItem;

public sealed record PublishContentItemCommand(Guid ContentItemId) : IRequest<Unit>;
