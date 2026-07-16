using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Commands.RestoreReference;

/// <summary>Restores a previously removed or broken reference back to active.</summary>
public sealed record RestoreReferenceCommand(Guid ReferenceId, Guid? ActorId = null) : IRequest<MediaReferenceResponse>;
