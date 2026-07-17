using MediatR;

namespace Sathus.Media.Application.Commands.RestoreMedia;

public sealed record RestoreMediaCommand(Guid Id, Guid? ActorId = null) : IRequest<Unit>;
