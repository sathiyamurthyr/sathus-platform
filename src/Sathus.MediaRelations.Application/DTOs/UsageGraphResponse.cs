namespace Sathus.MediaRelations.Application.DTOs;

public sealed record GraphNodeResponse(string NodeKey, string NodeType, int Depth, string? Label);

public sealed record GraphEdgeResponse(string SourceNodeKey, string TargetNodeKey, string Relationship);

/// <summary>The recursive usage graph rooted at an asset.</summary>
public sealed record UsageGraphResponse(
    Guid RootAssetId,
    string RootNodeKey,
    int MaxDepth,
    bool HasCycle,
    DateTime GeneratedAt,
    IReadOnlyList<GraphNodeResponse> Nodes,
    IReadOnlyList<GraphEdgeResponse> Edges);

/// <summary>A single (possibly transitive) dependent of an asset.</summary>
public sealed record DependentResponse(
    string NodeKey,
    string NodeType,
    int Level,
    bool IsDirect,
    bool IsCircular,
    string Path);
