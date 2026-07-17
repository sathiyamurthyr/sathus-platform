using Sathus.MediaRelations.Domain.Enums;
using Sathus.SharedKernel.Entities;

namespace Sathus.MediaRelations.Domain.Entities;

/// <summary>
/// A node within a <see cref="MediaRelationshipGraph"/>.
/// </summary>
public sealed class GraphNode : Entity
{
    public Guid GraphId { get; private set; }
    public string NodeKey { get; private set; } = string.Empty;
    public GraphNodeType NodeType { get; private set; }
    public string? Label { get; private set; }
    public int Depth { get; private set; }

    private GraphNode()
    {
    }

    public GraphNode(Guid graphId, string nodeKey, GraphNodeType nodeType, int depth, string? label = null)
    {
        Id = Guid.NewGuid();
        GraphId = graphId;
        NodeKey = nodeKey;
        NodeType = nodeType;
        Depth = depth;
        Label = label;
    }
}

/// <summary>
/// A directed edge within a <see cref="MediaRelationshipGraph"/> (source is referenced by target).
/// </summary>
public sealed class GraphEdge : Entity
{
    public Guid GraphId { get; private set; }
    public string SourceNodeKey { get; private set; } = string.Empty;
    public string TargetNodeKey { get; private set; } = string.Empty;
    public string Relationship { get; private set; } = string.Empty;

    private GraphEdge()
    {
    }

    public GraphEdge(Guid graphId, string sourceNodeKey, string targetNodeKey, string relationship)
    {
        Id = Guid.NewGuid();
        GraphId = graphId;
        SourceNodeKey = sourceNodeKey;
        TargetNodeKey = targetNodeKey;
        Relationship = relationship;
    }
}

/// <summary>
/// A materialised, cacheable usage graph rooted at an asset. Models the full
/// "Asset ← Content ← Landing Page ← Navigation" chain and supports recursive dependency
/// analysis and cycle detection over its in-memory node/edge collections.
/// </summary>
public sealed class MediaRelationshipGraph : AggregateRoot
{
    public Guid RootAssetId { get; private set; }
    public DateTime GeneratedAt { get; private set; }
    public int MaxDepth { get; private set; }
    public bool HasCycle { get; private set; }
    public Guid? TenantId { get; private set; }

    public ICollection<GraphNode> Nodes { get; private set; } = new List<GraphNode>();
    public ICollection<GraphEdge> Edges { get; private set; } = new List<GraphEdge>();

    private MediaRelationshipGraph()
    {
    }

    public MediaRelationshipGraph(Guid rootAssetId, Guid? tenantId = null)
    {
        if (rootAssetId == Guid.Empty)
        {
            throw new ArgumentException("Root asset id is required.", nameof(rootAssetId));
        }

        Id = Guid.NewGuid();
        RootAssetId = rootAssetId;
        TenantId = tenantId;
        GeneratedAt = DateTime.UtcNow;
        SetCreationAudit(null, GeneratedAt);

        AddNode(MediaRelation.AssetNode(rootAssetId), GraphNodeType.Asset, 0, $"asset:{rootAssetId:N}");
    }

    public string RootNodeKey => MediaRelation.AssetNode(RootAssetId);

    public GraphNode AddNode(string nodeKey, GraphNodeType nodeType, int depth, string? label = null)
    {
        var existing = Nodes.FirstOrDefault(n => n.NodeKey == nodeKey);
        if (existing is not null)
        {
            return existing;
        }

        var node = new GraphNode(Id, nodeKey, nodeType, depth, label);
        Nodes.Add(node);
        if (depth > MaxDepth)
        {
            MaxDepth = depth;
        }

        return node;
    }

    public void AddEdge(string sourceNodeKey, string targetNodeKey, string relationship)
    {
        if (Edges.Any(e => e.SourceNodeKey == sourceNodeKey && e.TargetNodeKey == targetNodeKey && e.Relationship == relationship))
        {
            return;
        }

        Edges.Add(new GraphEdge(Id, sourceNodeKey, targetNodeKey, relationship));
    }

    /// <summary>All nodes that (transitively) reference the root asset, ordered by depth.</summary>
    public IReadOnlyList<GraphNode> GetDependents() =>
        Nodes.Where(n => n.NodeKey != RootNodeKey)
             .OrderBy(n => n.Depth)
             .ThenBy(n => n.NodeKey)
             .ToList();

    /// <summary>The direct dependents (those that reference the root asset at depth 1).</summary>
    public IReadOnlyList<GraphNode> GetDirectDependents() =>
        Nodes.Where(n => n.Depth == 1).OrderBy(n => n.NodeKey).ToList();

    /// <summary>
    /// Detects whether the directed graph contains a cycle using depth-first search
    /// over the edge set. Sets <see cref="HasCycle"/> accordingly and returns the result.
    /// </summary>
    public bool DetectCycle()
    {
        var adjacency = Edges
            .GroupBy(e => e.SourceNodeKey)
            .ToDictionary(g => g.Key, g => g.Select(e => e.TargetNodeKey).ToList());

        var visited = new HashSet<string>();
        var inStack = new HashSet<string>();

        bool Visit(string node)
        {
            visited.Add(node);
            inStack.Add(node);

            if (adjacency.TryGetValue(node, out var neighbours))
            {
                foreach (var next in neighbours)
                {
                    if (!visited.Contains(next))
                    {
                        if (Visit(next))
                        {
                            return true;
                        }
                    }
                    else if (inStack.Contains(next))
                    {
                        return true;
                    }
                }
            }

            inStack.Remove(node);
            return false;
        }

        var hasCycle = Nodes.Select(n => n.NodeKey).Distinct().Any(key => !visited.Contains(key) && Visit(key));
        HasCycle = hasCycle;
        return hasCycle;
    }
}
