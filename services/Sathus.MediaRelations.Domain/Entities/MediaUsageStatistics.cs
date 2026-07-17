using Sathus.MediaRelations.Domain.Events;
using Sathus.SharedKernel.Entities;

namespace Sathus.MediaRelations.Domain.Entities;

/// <summary>
/// Aggregated, per-asset usage counters that power reporting and lifecycle policies
/// ("most used", "unused since"). Updated incrementally as references and interactions
/// occur so it can serve millions of assets without recomputing on read.
/// </summary>
public sealed class MediaUsageStatistics : AggregateRoot
{
    public Guid AssetId { get; private set; }

    /// <summary>Total number of times the asset has been referenced (including historical).</summary>
    public long UsageCount { get; private set; }

    public long DownloadCount { get; private set; }
    public long ViewCount { get; private set; }

    /// <summary>Number of currently active references.</summary>
    public int ReferenceCount { get; private set; }

    public DateTime? LastUsedAt { get; private set; }
    public DateTime? UnusedSince { get; private set; }
    public Guid? TenantId { get; private set; }

    public bool IsUnused => ReferenceCount == 0;

    private MediaUsageStatistics()
    {
    }

    public MediaUsageStatistics(Guid assetId, Guid? tenantId = null, Guid? createdBy = null)
    {
        if (assetId == Guid.Empty)
        {
            throw new ArgumentException("Asset id is required.", nameof(assetId));
        }

        Id = Guid.NewGuid();
        AssetId = assetId;
        TenantId = tenantId;
        UnusedSince = DateTime.UtcNow;
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }

    public void RecordReferenceAdded(Guid? updatedBy = null)
    {
        UsageCount++;
        ReferenceCount++;
        LastUsedAt = DateTime.UtcNow;
        UnusedSince = null;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        RaiseUsageUpdated();
    }

    public void RecordReferenceRemoved(Guid? updatedBy = null)
    {
        if (ReferenceCount > 0)
        {
            ReferenceCount--;
        }

        if (ReferenceCount == 0)
        {
            UnusedSince = DateTime.UtcNow;
        }

        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        RaiseUsageUpdated();
    }

    /// <summary>Reconciles the active reference count from an authoritative recount.</summary>
    public void SyncReferenceCount(int activeReferenceCount, Guid? updatedBy = null)
    {
        if (activeReferenceCount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(activeReferenceCount));
        }

        ReferenceCount = activeReferenceCount;
        if (ReferenceCount == 0)
        {
            UnusedSince ??= DateTime.UtcNow;
        }
        else
        {
            UnusedSince = null;
            LastUsedAt = DateTime.UtcNow;
        }

        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        RaiseUsageUpdated();
    }

    public void RecordView(long amount = 1, Guid? updatedBy = null)
    {
        if (amount <= 0)
        {
            return;
        }

        ViewCount += amount;
        LastUsedAt = DateTime.UtcNow;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void RecordDownload(long amount = 1, Guid? updatedBy = null)
    {
        if (amount <= 0)
        {
            return;
        }

        DownloadCount += amount;
        LastUsedAt = DateTime.UtcNow;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    private void RaiseUsageUpdated() =>
        AddDomainEvent(new AssetUsageUpdatedEvent(AssetId, ReferenceCount, UsageCount));
}
