using Sathus.MediaRelations.Domain.Enums;
using Sathus.MediaRelations.Domain.ValueObjects;
using Sathus.SharedKernel.Entities;

namespace Sathus.MediaRelations.Domain.Entities;

/// <summary>
/// A materialised dependency between two graph nodes discovered during recursive traversal.
/// The <see cref="Level"/> records how far the dependency sits from the root asset, and
/// <see cref="Path"/> keeps the traversal breadcrumb so cycles can be explained.
/// </summary>
public sealed class MediaDependency : AggregateRoot
{
    public Guid AssetId { get; private set; }
    public string DependentNodeKey { get; private set; } = string.Empty;
    public GraphNodeType DependentNodeType { get; private set; }
    public DependencyLevel Level { get; private set; } = null!;
    public string Path { get; private set; } = string.Empty;
    public bool IsCircular { get; private set; }
    public Guid? TenantId { get; private set; }

    private MediaDependency()
    {
    }

    public MediaDependency(
        Guid assetId,
        string dependentNodeKey,
        GraphNodeType dependentNodeType,
        DependencyLevel level,
        string path,
        bool isCircular = false,
        Guid? tenantId = null,
        Guid? createdBy = null)
    {
        if (assetId == Guid.Empty)
        {
            throw new ArgumentException("Asset id is required.", nameof(assetId));
        }

        if (string.IsNullOrWhiteSpace(dependentNodeKey))
        {
            throw new ArgumentException("Dependent node key is required.", nameof(dependentNodeKey));
        }

        Id = Guid.NewGuid();
        AssetId = assetId;
        DependentNodeKey = dependentNodeKey.Trim();
        DependentNodeType = dependentNodeType;
        Level = level ?? DependencyLevel.Create(0);
        Path = path ?? string.Empty;
        IsCircular = isCircular;
        TenantId = tenantId;
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }

    public void MarkCircular(Guid? updatedBy = null)
    {
        IsCircular = true;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }
}
