using MediatR;

namespace Sathus.MediaRelations.Application.Commands.RemoveReference;

/// <summary>Removes (soft-deletes) a reference and decrements the related projections.</summary>
public sealed record RemoveReferenceCommand(Guid ReferenceId, Guid? ActorId = null) : IRequest<Unit>;
