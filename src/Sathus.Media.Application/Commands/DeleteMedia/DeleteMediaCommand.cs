using MediatR;

namespace Sathus.Media.Application.Commands.DeleteMedia;

public sealed record DeleteMediaCommand(Guid Id, Guid? ActorId = null) : IRequest<Unit>;
