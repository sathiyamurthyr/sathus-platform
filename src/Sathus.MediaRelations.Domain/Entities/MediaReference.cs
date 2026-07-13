using Sathus.MediaRelations.Domain.Enums;
using Sathus.MediaRelations.Domain.Events;
using Sathus.MediaRelations.Domain.Exceptions;
using Sathus.MediaRelations.Domain.ValueObjects;
using Sathus.SharedKernel.Entities;

namespace Sathus.MediaRelations.Domain.Entities;

/// <summary>
/// The single source of truth for a place where a media asset is used. A reference links
/// an asset to a piece of source content (identified by module + <see cref="ReferenceType"/>
/// + <see cref="ReferenceId"/>) in a specific relationship (<see cref="UsageType"/>) at a
/// precise <see cref="ReferencePath"/> and lifecycle <see cref="ReferenceScope"/>.
/// </summary>
public sealed class MediaReference : AggregateRoot
{
    public Guid AssetId { get; private set; }

    /// <summary>Open module name owning the content (no hardcoded module logic).</summary>
    public string Module { get; private set; } = string.Empty;

    public ReferenceType ReferenceType { get; private set; } = null!;
    public ReferenceId SourceReferenceId { get; private set; } = null!;
    public UsageType UsageType { get; private set; } = null!;
    public ReferencePath Path { get; private set; } = null!;
    public ReferenceScope Scope { get; private set; } = null!;
    public ReferenceVersion Version { get; private set; } = null!;

    public ReferenceStatus Status { get; private set; }
    public string? BrokenReason { get; private set; }
    public DateTime? LastValidatedAt { get; private set; }
    public DateTime? ScheduledFor { get; private set; }
    public Guid? TenantId { get; private set; }
    public string? Title { get; private set; }
    public string? Url { get; private set; }

    private MediaReference()
    {
    }

    public MediaReference(
        Guid assetId,
        string module,
        ReferenceType referenceType,
        ReferenceId sourceReferenceId,
        UsageType usageType,
        ReferencePath? path = null,
        ReferenceScope? scope = null,
        Guid? tenantId = null,
        string? title = null,
        string? url = null,
        DateTime? scheduledFor = null,
        Guid? createdBy = null)
    {
        if (assetId == Guid.Empty)
        {
            throw new ArgumentException("Asset id is required.", nameof(assetId));
        }

        if (string.IsNullOrWhiteSpace(module))
        {
            throw new ArgumentException("Module is required.", nameof(module));
        }

        Id = Guid.NewGuid();
        AssetId = assetId;
        Module = module.Trim();
        ReferenceType = referenceType ?? throw new ArgumentNullException(nameof(referenceType));
        SourceReferenceId = sourceReferenceId ?? throw new ArgumentNullException(nameof(sourceReferenceId));
        UsageType = usageType ?? throw new ArgumentNullException(nameof(usageType));
        Path = path ?? ReferencePath.Root;
        Scope = scope ?? ReferenceScope.Draft;
        Version = ReferenceVersion.Create(1);
        Status = ReferenceStatus.Active;
        TenantId = tenantId;
        Title = title;
        Url = url;
        ScheduledFor = scheduledFor;
        SetCreationAudit(createdBy, DateTime.UtcNow);

        AddDomainEvent(new AssetReferencedEvent(
            Id, AssetId, ReferenceType.Value, SourceReferenceId.Value, UsageType.Value));
    }

    /// <summary>Deterministic key used to detect duplicate references.</summary>
    public string DeduplicationKey =>
        $"{AssetId:N}|{Module.ToLowerInvariant()}|{ReferenceType.Value}|{SourceReferenceId.Value}|{UsageType.Value}|{Path.Value}";

    public bool IsActive => Status == ReferenceStatus.Active;

    public bool IsBroken => Status == ReferenceStatus.Broken;

    public bool IsRemoved => Status == ReferenceStatus.Removed;

    /// <summary>True when this reference should block deletion of its asset.</summary>
    public bool IsBlockingDeletion => IsActive && (Scope.IsActive || IsScheduledInFuture);

    public bool IsScheduledInFuture =>
        Scope.Value == ReferenceScope.ScheduledValue && ScheduledFor.HasValue && ScheduledFor.Value > DateTime.UtcNow;

    public void Retarget(Guid newAssetId, Guid? updatedBy = null)
    {
        if (newAssetId == Guid.Empty)
        {
            throw new ArgumentException("Asset id is required.", nameof(newAssetId));
        }

        if (IsRemoved)
        {
            throw new InvalidReferenceStateException("Cannot retarget a removed reference; restore it first.");
        }

        AssetId = newAssetId;
        BumpVersion(updatedBy);
    }

    public void UpdatePlacement(string? title, string? url, ReferencePath? path, Guid? updatedBy = null)
    {
        if (IsRemoved)
        {
            throw new InvalidReferenceStateException("Cannot update a removed reference; restore it first.");
        }

        Title = title;
        Url = url;
        if (path is not null)
        {
            Path = path;
        }

        BumpVersion(updatedBy);
    }

    public void ChangeScope(ReferenceScope scope, DateTime? scheduledFor = null, Guid? updatedBy = null)
    {
        ArgumentNullException.ThrowIfNull(scope);

        if (IsRemoved)
        {
            throw new InvalidReferenceStateException("Cannot change scope of a removed reference; restore it first.");
        }

        Scope = scope;
        ScheduledFor = scope.Value == ReferenceScope.ScheduledValue ? scheduledFor : null;
        BumpVersion(updatedBy);
    }

    public void MarkBroken(string reason, Guid? updatedBy = null)
    {
        if (string.IsNullOrWhiteSpace(reason))
        {
            reason = "Referenced asset is missing.";
        }

        if (Status == ReferenceStatus.Broken)
        {
            return;
        }

        Status = ReferenceStatus.Broken;
        BrokenReason = reason.Trim();
        LastValidatedAt = DateTime.UtcNow;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new ReferenceBrokenEvent(Id, AssetId, BrokenReason));
    }

    public void MarkValid(Guid? updatedBy = null)
    {
        LastValidatedAt = DateTime.UtcNow;

        if (Status == ReferenceStatus.Broken)
        {
            Status = ReferenceStatus.Active;
            BrokenReason = null;
            SetUpdateAudit(updatedBy, DateTime.UtcNow);
            AddDomainEvent(new ReferenceRestoredEvent(Id, AssetId));
        }
        else
        {
            SetUpdateAudit(updatedBy, DateTime.UtcNow);
        }
    }

    public void Restore(Guid? updatedBy = null)
    {
        if (Status == ReferenceStatus.Active)
        {
            return;
        }

        Status = ReferenceStatus.Active;
        BrokenReason = null;
        base.Restore(updatedBy, DateTime.UtcNow);
        BumpVersion(updatedBy, raiseReferencedEvent: false);
        AddDomainEvent(new ReferenceRestoredEvent(Id, AssetId));
    }

    public void Remove(Guid? updatedBy = null)
    {
        if (Status == ReferenceStatus.Removed)
        {
            return;
        }

        Status = ReferenceStatus.Removed;
        MarkDeleted(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new AssetUnreferencedEvent(Id, AssetId));
    }

    private void BumpVersion(Guid? updatedBy, bool raiseReferencedEvent = false)
    {
        Version = Version.Next();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        if (raiseReferencedEvent)
        {
            AddDomainEvent(new AssetReferencedEvent(
                Id, AssetId, ReferenceType.Value, SourceReferenceId.Value, UsageType.Value));
        }
    }
}
