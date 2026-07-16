using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;

namespace Sathus.MediaRelations.Infrastructure.Services;

/// <summary>
/// Builds a recursive usage graph rooted at an asset by walking relation edges breadth-first.
/// Results are cached; the traversal is bounded by <paramref name="maxDepth"/> and detects cycles.
/// </summary>
public sealed class UsageGraphBuilder : IUsageGraphBuilder
{
    private readonly IMediaRelationRepository _relations;
    private readonly IUsageGraphCache _cache;

    public UsageGraphBuilder(IMediaRelationRepository relations, IUsageGraphCache cache)
    {
        _relations = relations;
        _cache = cache;
    }

    public async Task<MediaRelationshipGraph> BuildAsync(Guid assetId, int maxDepth = 16, CancellationToken cancellationToken = default)
    {
        var cached = await _cache.GetAsync(assetId, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        var graph = new MediaRelationshipGraph(assetId);
        var rootKey = graph.RootNodeKey;

        var depthByNode = new Dictionary<string, int> { [rootKey] = 0 };
        var queue = new Queue<string>();
        queue.Enqueue(rootKey);

        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            var currentDepth = depthByNode[current];
            if (currentDepth >= maxDepth)
            {
                continue;
            }

            var edges = await _relations.GetBySourceNodeAsync(current, cancellationToken);
            foreach (var edge in edges)
            {
                graph.AddEdge(edge.SourceNodeKey, edge.TargetNodeKey, edge.Relationship);

                if (!depthByNode.ContainsKey(edge.TargetNodeKey))
                {
                    depthByNode[edge.TargetNodeKey] = currentDepth + 1;
                    graph.AddNode(edge.TargetNodeKey, edge.TargetNodeType, currentDepth + 1, edge.TargetNodeKey);
                    queue.Enqueue(edge.TargetNodeKey);
                }
            }
        }

        graph.DetectCycle();

        await _cache.SetAsync(graph, cancellationToken);
        return graph;
    }
}
