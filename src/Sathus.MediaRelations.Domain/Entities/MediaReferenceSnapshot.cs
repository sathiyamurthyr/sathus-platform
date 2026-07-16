using Sathus.SharedKernel.Entities;

namespace Sathus.MediaRelations.Domain.Entities;

/// <summary>
/// A point-in-time snapshot of every reference for an asset, serialised for durable
/// history and disaster-recovery style restore. Snapshots are immutable once created.
/// </summary>
public sealed class MediaReferenceSnapshot : AggregateRoot
{
    public Guid AssetId { get; private set; }
    public int ReferenceCount { get; private set; }

    /// <summary>Opaque serialised payload capturing the reference set at capture time.</summary>
    public string Payload { get; private set; } = string.Empty;

    /// <summary>Deterministic content hash used to detect drift between snapshots.</summary>
    public string ContentHash { get; private set; } = string.Empty;

    public string? Reason { get; private set; }
    public Guid? TenantId { get; private set; }
    public DateTime CapturedAt { get; private set; }

    private MediaReferenceSnapshot()
    {
    }

    public MediaReferenceSnapshot(
        Guid assetId,
        int referenceCount,
        string payload,
        string? reason = null,
        Guid? tenantId = null,
        Guid? createdBy = null)
    {
        if (assetId == Guid.Empty)
        {
            throw new ArgumentException("Asset id is required.", nameof(assetId));
        }

        Id = Guid.NewGuid();
        AssetId = assetId;
        ReferenceCount = referenceCount;
        Payload = payload ?? string.Empty;
        ContentHash = ComputeHash(Payload);
        Reason = reason;
        TenantId = tenantId;
        CapturedAt = DateTime.UtcNow;
        SetCreationAudit(createdBy, CapturedAt);
    }

    public bool Matches(string payload) => ComputeHash(payload ?? string.Empty) == ContentHash;

    private static string ComputeHash(string value)
    {
        var bytes = System.Text.Encoding.UTF8.GetBytes(value);
        var hash = System.Security.Cryptography.SHA256.HashData(bytes);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }
}
