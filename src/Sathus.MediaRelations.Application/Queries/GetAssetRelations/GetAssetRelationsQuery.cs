using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Queries.GetAssetRelations;

/// <summary>Returns the direct relation edges touching an asset node.</summary>
public sealed record GetAssetRelationsQuery(Guid AssetId) : IRequest<IReadOnlyList<MediaRelationResponse>>;
