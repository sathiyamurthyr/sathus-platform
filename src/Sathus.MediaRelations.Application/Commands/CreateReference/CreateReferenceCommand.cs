using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Commands.CreateReference;

/// <summary>
/// Registers a new usage of an asset by a piece of content. This is the primary write
/// entry point of the reference engine.
/// </summary>
public sealed record CreateReferenceCommand(
    Guid AssetId,
    string Module,
    string ReferenceType,
    string SourceReferenceId,
    string UsageType,
    string? Path = null,
    string? Scope = null,
    string? Title = null,
    string? Url = null,
    DateTime? ScheduledFor = null,
    Guid? TenantId = null,
    Guid? ActorId = null)
    : IRequest<MediaReferenceResponse>;
