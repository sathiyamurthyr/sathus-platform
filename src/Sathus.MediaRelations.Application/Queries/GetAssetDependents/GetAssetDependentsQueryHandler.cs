using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Application.Queries.GetAssetDependents;

public sealed class GetAssetDependentsQueryHandler
    : IRequestHandler<GetAssetDependentsQuery, IReadOnlyList<DependentResponse>>
{
    private readonly IUsageGraphBuilder _graphBuilder;

    public GetAssetDependentsQueryHandler(IUsageGraphBuilder graphBuilder)
    {
        _graphBuilder = graphBuilder;
    }

    public async Task<IReadOnlyList<DependentResponse>> Handle(GetAssetDependentsQuery request, CancellationToken cancellationToken)
    {
        var graph = await _graphBuilder.BuildAsync(request.AssetId, request.MaxDepth, cancellationToken);
        var rootKey = graph.RootNodeKey;

        // Map each dependent node to the shortest path from the root for a stable breadcrumb.
        var incoming = graph.Edges
            .GroupBy(e => e.TargetNodeKey)
            .ToDictionary(g => g.Key, g => g.Select(e => e.SourceNodeKey).ToList());

        return graph.GetDependents()
            .Select(node => new DependentResponse(
                node.NodeKey,
                node.NodeType.ToString(),
                node.Depth,
                node.Depth == 1,
                graph.HasCycle && IsOnCycle(node.NodeKey, incoming, rootKey),
                BuildPath(node.NodeKey, incoming, rootKey)))
            .ToList();
    }

    private static string BuildPath(string node, IReadOnlyDictionary<string, List<string>> incoming, string rootKey)
    {
        var path = new List<string> { node };
        var current = node;
        var guard = 0;
        while (current != rootKey && incoming.TryGetValue(current, out var sources) && sources.Count > 0 && guard++ < 64)
        {
            current = sources[0];
            path.Add(current);
            if (current == rootKey)
            {
                break;
            }
        }

        path.Reverse();
        return string.Join(" -> ", path);
    }

    private static bool IsOnCycle(string node, IReadOnlyDictionary<string, List<string>> incoming, string rootKey)
    {
        var visited = new HashSet<string>();
        var current = node;
        var guard = 0;
        while (incoming.TryGetValue(current, out var sources) && sources.Count > 0 && guard++ < 128)
        {
            if (!visited.Add(current))
            {
                return true;
            }

            current = sources[0];
            if (current == rootKey)
            {
                return false;
            }
        }

        return false;
    }
}
