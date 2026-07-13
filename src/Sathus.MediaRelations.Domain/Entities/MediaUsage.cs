using Sathus.MediaRelations.Domain.Events;
using Sathus.MediaRelations.Domain.ValueObjects;
using Sathus.SharedKernel.Entities;

namespace Sathus.MediaRelations.Domain.Entities;

/// <summary>
/// Denormalised usage edge that aggregates every <see cref="MediaReference"/> from a single
/// content item to a single asset. It is the coarse-grained unit consumed by the usage graph
/// and by fast "who uses this asset" queries, and is maintained incrementally from references.
/// </summary>
public sealed class MediaUsage : AggregateRoot
{
    public Guid AssetId { get; private set; }
    public string Module { get; private set; } = string.Empty;
    public ReferenceType ReferenceType { get; private set; } = null!;
    public ReferenceId SourceReferenceId { get; private set; } = null!;
    public int ActiveReferenceCount { get; private set; }
    public string UsageTypes { get; private set; } = string.Empty;
    public Guid? TenantId { get; private set; }
    public DateTime FirstReferencedAt { get; private set; }
    public DateTime LastReferencedAt { get; private set; }
    public bool IsActive => ActiveReferenceCount > 0;

    private MediaUsage()
    {
    }

    public MediaUsage(
        Guid assetId,
        string module,
        ReferenceType referenceType,
        ReferenceId sourceReferenceId,
        Guid? tenantId = null,
        Guid? createdBy = null)
    {
        Id = Guid.NewGuid();
        AssetId = assetId;
        Module = module.Trim();
        ReferenceType = referenceType;
        SourceReferenceId = sourceReferenceId;
        TenantId = tenantId;
        ActiveReferenceCount = 0;
        FirstReferencedAt = DateTime.UtcNow;
        LastReferencedAt = DateTime.UtcNow;
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }

    public string Key => $"{AssetId:N}|{Module.ToLowerInvariant()}|{ReferenceType.Value}|{SourceReferenceId.Value}";

    public IReadOnlyCollection<string> GetUsageTypes() =>
        string.IsNullOrEmpty(UsageTypes)
            ? Array.Empty<string>()
            : UsageTypes.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

    public void RecordReference(UsageType usageType, Guid? updatedBy = null)
    {
        ArgumentNullException.ThrowIfNull(usageType);

        ActiveReferenceCount++;
        var set = new HashSet<string>(GetUsageTypes(), StringComparer.OrdinalIgnoreCase) { usageType.Value };
        UsageTypes = string.Join(',', set);
        LastReferencedAt = DateTime.UtcNow;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new AssetUsageUpdatedEvent(AssetId, ActiveReferenceCount, ActiveReferenceCount));
    }

    public void RemoveReference(Guid? updatedBy = null)
    {
        if (ActiveReferenceCount > 0)
        {
            ActiveReferenceCount--;
        }

        LastReferencedAt = DateTime.UtcNow;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new AssetUsageUpdatedEvent(AssetId, ActiveReferenceCount, ActiveReferenceCount));
    }
}
