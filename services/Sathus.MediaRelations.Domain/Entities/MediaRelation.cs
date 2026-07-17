using Sathus.MediaRelations.Domain.Enums;
using Sathus.SharedKernel.Entities;

namespace Sathus.MediaRelations.Domain.Entities;

/// <summary>
/// A directed edge in the usage/relationship graph: <c>Source</c> is referenced by, or
/// depends upon, <c>Target</c>. Nodes are modelled uniformly (asset or content) so the
/// chain "Asset ← Content ← Landing Page ← Navigation" can be walked recursively.
/// </summary>
public sealed class MediaRelation : AggregateRoot
{
    /// <summary>Composite key of the source node (e.g. "asset:{guid}" or "page:home").</summary>
    public string SourceNodeKey { get; private set; } = string.Empty;
    public GraphNodeType SourceNodeType { get; private set; }

    /// <summary>Composite key of the target node that references / owns the source.</summary>
    public string TargetNodeKey { get; private set; } = string.Empty;
    public GraphNodeType TargetNodeType { get; private set; }

    /// <summary>The relationship label (usage type or a custom relation name).</summary>
    public string Relationship { get; private set; } = string.Empty;
    public Guid? TenantId { get; private set; }

    private MediaRelation()
    {
    }

    public MediaRelation(
        string sourceNodeKey,
        GraphNodeType sourceNodeType,
        string targetNodeKey,
        GraphNodeType targetNodeType,
        string relationship,
        Guid? tenantId = null,
        Guid? createdBy = null)
    {
        if (string.IsNullOrWhiteSpace(sourceNodeKey))
        {
            throw new ArgumentException("Source node key is required.", nameof(sourceNodeKey));
        }

        if (string.IsNullOrWhiteSpace(targetNodeKey))
        {
            throw new ArgumentException("Target node key is required.", nameof(targetNodeKey));
        }

        if (string.Equals(sourceNodeKey, targetNodeKey, StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("A node cannot be related to itself.", nameof(targetNodeKey));
        }

        Id = Guid.NewGuid();
        SourceNodeKey = sourceNodeKey.Trim();
        SourceNodeType = sourceNodeType;
        TargetNodeKey = targetNodeKey.Trim();
        TargetNodeType = targetNodeType;
        Relationship = string.IsNullOrWhiteSpace(relationship) ? "references" : relationship.Trim();
        TenantId = tenantId;
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }

    public static string AssetNode(Guid assetId) => $"asset:{assetId:N}";

    public static string ContentNode(string referenceType, string referenceId) =>
        $"{referenceType.Trim().ToLowerInvariant()}:{referenceId.Trim()}";

    public string DeduplicationKey =>
        $"{SourceNodeKey}=>{TargetNodeKey}|{Relationship.ToLowerInvariant()}";
}
