using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Commands.UpdateReference;

/// <summary>Updates the placement, scope or target of an existing reference.</summary>
public sealed record UpdateReferenceCommand(
    Guid ReferenceId,
    Guid? NewAssetId = null,
    string? Title = null,
    string? Url = null,
    string? Path = null,
    string? Scope = null,
    DateTime? ScheduledFor = null,
    Guid? ActorId = null)
    : IRequest<MediaReferenceResponse>;
