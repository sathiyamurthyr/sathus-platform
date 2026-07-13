using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Application.Queries.GetAssetRelations;

public sealed class GetAssetRelationsQueryHandler
    : IRequestHandler<GetAssetRelationsQuery, IReadOnlyList<MediaRelationResponse>>
{
    private readonly IMediaRelationRepository _relations;

    public GetAssetRelationsQueryHandler(IMediaRelationRepository relations)
    {
        _relations = relations;
    }

    public async Task<IReadOnlyList<MediaRelationResponse>> Handle(GetAssetRelationsQuery request, CancellationToken cancellationToken)
    {
        var assetNode = MediaRelation.AssetNode(request.AssetId);
        var edges = await _relations.GetBySourceNodeAsync(assetNode, cancellationToken);
        return edges.Select(MediaRelationResponse.From).ToList();
    }
}
