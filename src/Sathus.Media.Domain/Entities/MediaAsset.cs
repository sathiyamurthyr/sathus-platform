using Sathus.Media.Domain.Enums;
using Sathus.Media.Domain.Events;
using Sathus.Media.Domain.Exceptions;
using Sathus.Media.Domain.ValueObjects;
using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// Aggregate root representing a managed digital asset. Owns its metadata, versions,
/// usage records, audit trail and sharing/permission graph.
/// </summary>
public sealed class MediaAsset : AggregateRoot
{
    public FileName FileName { get; private set; } = null!;
    public FileExtension FileExtension { get; private set; } = null!;
    public MimeType MimeType { get; private set; } = null!;
    public FileSize Size { get; private set; } = null!;
    public Checksum Checksum { get; private set; } = null!;
    public StorageKey StorageKey { get; private set; } = null!;
    public AltText? AltText { get; private set; }
    public MediaType Type { get; private set; } = null!;
    public MediaStatus Status { get; private set; }
    public LanguageCode Language { get; private set; } = null!;
    public ImageDimensions? Dimensions { get; private set; }
    public Duration? Duration { get; private set; }
    public Hash? Hash { get; private set; }
    public Guid? FolderId { get; private set; }
    public Guid? OwnerId { get; private set; }
    public Guid? TenantId { get; private set; }
    public string? Title { get; private set; }
    public string? Description { get; private set; }

    public ICollection<MediaAssetTag> Tags { get; } = new List<MediaAssetTag>();
    public ICollection<MediaUsage> Usages { get; } = new List<MediaUsage>();
    public ICollection<MediaVersion> Versions { get; } = new List<MediaVersion>();
    public ICollection<MediaMetadata> Metadata { get; } = new List<MediaMetadata>();
    public ICollection<MediaRelation> Relations { get; } = new List<MediaRelation>();
    public ICollection<MediaShare> Shares { get; } = new List<MediaShare>();

    public MediaId MediaId => new(Id);

    private MediaAsset()
    {
    }

    private MediaAsset(
        FileName fileName,
        FileExtension fileExtension,
        MimeType mimeType,
        FileSize size,
        Checksum checksum,
        StorageKey storageKey,
        MediaType type,
        LanguageCode language,
        MediaStatus initialStatus,
        Guid? ownerId,
        Guid? tenantId,
        Guid? folderId,
        Guid? createdBy,
        AltText? altText,
        ImageDimensions? dimensions,
        Duration? duration,
        Hash? hash,
        string? title,
        string? description)
    {
        Id = Guid.NewGuid();
        FileName = fileName;
        FileExtension = fileExtension;
        MimeType = mimeType;
        Size = size;
        Checksum = checksum;
        StorageKey = storageKey;
        Type = type;
        Language = language;
        Status = initialStatus;
        OwnerId = ownerId;
        TenantId = tenantId;
        FolderId = folderId;
        AltText = altText;
        Dimensions = dimensions;
        Duration = duration;
        Hash = hash;
        Title = title;
        Description = description;
        var now = DateTime.UtcNow;
        SetCreationAudit(createdBy, now);
    }

    public static MediaAsset Create(
        FileName fileName,
        FileExtension fileExtension,
        MimeType mimeType,
        FileSize size,
        Checksum checksum,
        StorageKey storageKey,
        MediaType type,
        LanguageCode language,
        Guid? ownerId = null,
        Guid? tenantId = null,
        Guid? folderId = null,
        MediaStatus initialStatus = MediaStatus.Draft,
        Guid? createdBy = null,
        AltText? altText = null,
        ImageDimensions? dimensions = null,
        Duration? duration = null,
        Hash? hash = null,
        string? title = null,
        string? description = null)
    {
        if (initialStatus is MediaStatus.Deleted or MediaStatus.Archived)
        {
            throw new ArgumentException("A new asset cannot start in a deleted or archived state.", nameof(initialStatus));
        }

        if (type.Value == MediaType.Image.Value && dimensions is null)
        {
            throw new ArgumentException("Image assets require dimensions.", nameof(dimensions));
        }

        if ((type.Value == MediaType.Video.Value || type.Value == MediaType.Audio.Value) && duration is null)
        {
            throw new ArgumentException("Audio and video assets require a duration.", nameof(duration));
        }

        var asset = new MediaAsset(
            fileName, fileExtension, mimeType, size, checksum, storageKey, type, language,
            initialStatus, ownerId, tenantId, folderId, createdBy, altText, dimensions, duration, hash, title, description);

        asset.AddDomainEvent(new MediaCreatedEvent(asset.Id));
        return asset;
    }

    public void UpdateMetadata(
        AltText? altText,
        LanguageCode language,
        string? title,
        string? description,
        Guid? folderId,
        Guid? updatedBy)
    {
        EnsureEditable();

        AltText = altText;
        Language = language;
        Title = title;
        Description = description;
        FolderId = folderId;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);

        AddDomainEvent(new MediaUpdatedEvent(Id));
    }

    public void MarkProcessing(Guid? updatedBy)
    {
        TransitionTo(MediaStatus.Processing, updatedBy);
    }

    public void MarkReady(Guid? updatedBy)
    {
        TransitionTo(MediaStatus.Ready, updatedBy);
        AddDomainEvent(new MediaUpdatedEvent(Id));
    }

    public void MarkFailed(Guid? updatedBy)
    {
        TransitionTo(MediaStatus.Failed, updatedBy);
    }

    public void Archive(Guid? updatedBy)
    {
        EnsureNotDeleted();
        TransitionTo(MediaStatus.Archived, updatedBy);
        AddDomainEvent(new MediaArchivedEvent(Id));
    }

    public void Delete(Guid? deletedBy)
    {
        EnsureNotDeleted();
        Status = MediaStatus.Deleted;
        MarkDeleted(deletedBy, DateTime.UtcNow);
        AddDomainEvent(new MediaDeletedEvent(Id));
    }

    public void Restore(Guid? restoredBy)
    {
        if (!IsDeleted)
        {
            throw new InvalidMediaStatusTransitionException("Only a deleted asset can be restored.");
        }

        Restore(restoredBy, DateTime.UtcNow);
        Status = MediaStatus.Ready;
        AddDomainEvent(new MediaRestoredEvent(Id));
    }

    private void TransitionTo(MediaStatus target, Guid? updatedBy)
    {
        if (!IsValidTransition(Status, target))
        {
            throw new InvalidMediaStatusTransitionException(
                $"Cannot transition media asset from '{Status}' to '{target}'.");
        }

        Status = target;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    private void EnsureEditable()
    {
        if (Status is MediaStatus.Deleted)
        {
            throw new InvalidMediaStatusTransitionException("A deleted asset cannot be edited.");
        }
    }

    private void EnsureNotDeleted()
    {
        if (Status is MediaStatus.Deleted)
        {
            throw new InvalidMediaStatusTransitionException("Operation is not allowed on a deleted asset.");
        }
    }

    private static bool IsValidTransition(MediaStatus from, MediaStatus to)
    {
        if (from == to)
        {
            return true;
        }

        return from switch
        {
            MediaStatus.Draft => to is MediaStatus.Processing or MediaStatus.Ready or MediaStatus.Failed or MediaStatus.Archived,
            MediaStatus.Processing => to is MediaStatus.Ready or MediaStatus.Failed or MediaStatus.Archived,
            MediaStatus.Ready => to is MediaStatus.Archived or MediaStatus.Processing,
            MediaStatus.Failed => to is MediaStatus.Draft or MediaStatus.Processing,
            MediaStatus.Archived => to is MediaStatus.Ready,
            MediaStatus.Deleted => false,
            _ => false
        };
    }
}
