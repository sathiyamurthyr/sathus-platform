using MediatR;

namespace Sathus.Media.Application.Commands.ArchiveMedia;

public sealed record ArchiveMediaCommand(Guid Id, Guid? ActorId = null) : IRequest<Unit>;
