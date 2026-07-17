using MediatR;
using Sathus.Media.Application.DTOs;

namespace Sathus.Media.Application.Commands.UpdateMediaMetadata;

public sealed record UpdateMediaMetadataCommand(
    Guid Id,
    string? AltText = null,
    string? Language = null,
    string? Title = null,
    string? Description = null,
    Guid? FolderId = null,
    Guid? ActorId = null)
    : IRequest<MediaAssetResponse>;
