using MediatR;

namespace Sathus.Content.Application.Commands.UnpublishContentItem;

public sealed record UnpublishContentItemCommand(Guid ContentItemId) : IRequest<Unit>;
