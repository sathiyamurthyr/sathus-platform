using Sathus.SharedKernel.Events;

namespace Sathus.MediaRelations.Domain.Events;

/// <summary>Raised when an asset becomes referenced by a piece of content.</summary>
public sealed class AssetReferencedEvent : DomainEvent
{
    public Guid ReferenceId { get; }
    public Guid AssetId { get; }
    public string ReferenceType { get; }
    public string SourceReferenceId { get; }
    public string UsageType { get; }

    public AssetReferencedEvent(
        Guid referenceId,
        Guid assetId,
        string referenceType,
        string sourceReferenceId,
        string usageType)
    {
        ReferenceId = referenceId;
        AssetId = assetId;
        ReferenceType = referenceType;
        SourceReferenceId = sourceReferenceId;
        UsageType = usageType;
    }
}

/// <summary>Raised when a reference to an asset is removed.</summary>
public sealed class AssetUnreferencedEvent : DomainEvent
{
    public Guid ReferenceId { get; }
    public Guid AssetId { get; }

    public AssetUnreferencedEvent(Guid referenceId, Guid assetId)
    {
        ReferenceId = referenceId;
        AssetId = assetId;
    }
}

/// <summary>Raised when a reference is detected to be broken (target asset missing/invalid).</summary>
public sealed class ReferenceBrokenEvent : DomainEvent
{
    public Guid ReferenceId { get; }
    public Guid AssetId { get; }
    public string Reason { get; }

    public ReferenceBrokenEvent(Guid referenceId, Guid assetId, string reason)
    {
        ReferenceId = referenceId;
        AssetId = assetId;
        Reason = reason;
    }
}

/// <summary>Raised when a previously broken/removed reference is restored to active.</summary>
public sealed class ReferenceRestoredEvent : DomainEvent
{
    public Guid ReferenceId { get; }
    public Guid AssetId { get; }

    public ReferenceRestoredEvent(Guid referenceId, Guid assetId)
    {
        ReferenceId = referenceId;
        AssetId = assetId;
    }
}

/// <summary>Raised when aggregated usage statistics for an asset change.</summary>
public sealed class AssetUsageUpdatedEvent : DomainEvent
{
    public Guid AssetId { get; }
    public int ReferenceCount { get; }
    public long UsageCount { get; }

    public AssetUsageUpdatedEvent(Guid assetId, int referenceCount, long usageCount)
    {
        AssetId = assetId;
        ReferenceCount = referenceCount;
        UsageCount = usageCount;
    }
}
