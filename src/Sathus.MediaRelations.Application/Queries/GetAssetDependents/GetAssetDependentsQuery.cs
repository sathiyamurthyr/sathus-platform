using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Queries.GetAssetDependents;

/// <summary>Returns the recursive set of nodes that depend on (reference) an asset.</summary>
public sealed record GetAssetDependentsQuery(Guid AssetId, int MaxDepth = 16)
    : IRequest<IReadOnlyList<DependentResponse>>;
