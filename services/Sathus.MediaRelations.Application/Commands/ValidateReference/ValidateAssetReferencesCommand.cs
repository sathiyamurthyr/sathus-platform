using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Commands.ValidateReference;

/// <summary>
/// Validates every reference of an asset against the DAM Foundation, marking references
/// broken when the asset is missing and restoring them when it reappears.
/// </summary>
public sealed record ValidateAssetReferencesCommand(Guid AssetId, Guid? ActorId = null)
    : IRequest<ReferenceValidationResponse>;
