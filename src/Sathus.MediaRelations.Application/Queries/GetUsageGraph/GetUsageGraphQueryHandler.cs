using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;

namespace Sathus.MediaRelations.Application.Queries.GetUsageGraph;

public sealed class GetUsageGraphQueryHandler : IRequestHandler<GetUsageGraphQuery, UsageGraphResponse>
{
    private readonly IUsageGraphBuilder _graphBuilder;

    public GetUsageGraphQueryHandler(IUsageGraphBuilder graphBuilder)
    {
        _graphBuilder = graphBuilder;
    }

    public async Task<UsageGraphResponse> Handle(GetUsageGraphQuery request, CancellationToken cancellationToken)
    {
        var graph = await _graphBuilder.BuildAsync(request.AssetId, request.MaxDepth, cancellationToken);

        return new UsageGraphResponse(
            graph.RootAssetId,
            graph.RootNodeKey,
            graph.MaxDepth,
            graph.HasCycle,
            graph.GeneratedAt,
            graph.Nodes.Select(n => new GraphNodeResponse(n.NodeKey, n.NodeType.ToString(), n.Depth, n.Label)).ToList(),
            graph.Edges.Select(e => new GraphEdgeResponse(e.SourceNodeKey, e.TargetNodeKey, e.Relationship)).ToList());
    }
}
