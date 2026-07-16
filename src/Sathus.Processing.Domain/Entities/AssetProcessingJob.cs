using System.Collections.ObjectModel;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Domain.Enums;
using Sathus.Processing.Domain.Events;
using Sathus.Processing.Domain.Exceptions;
using Sathus.Processing.Domain.ValueObjects;

namespace Sathus.Processing.Domain.Entities;

/// <summary>
/// Aggregate root representing a single asynchronous asset processing job. Tracks
/// lifecycle, retry state, extracted metadata and generated renditions, and raises
/// domain events consumed by future notification/workflow modules.
/// </summary>
public sealed class AssetProcessingJob : AggregateRoot
{
    public Guid AssetId { get; private set; }
    public string StorageKey { get; private set; } = string.Empty;
    public string FileName { get; private set; } = string.Empty;
    public string MimeType { get; private set; } = string.Empty;
    public string MediaTypeValue { get; private set; } = string.Empty;
    public long FileSize { get; private set; }
    public ProcessingStatus Status { get; private set; }
    public ProcessingStep CurrentStep { get; private set; }
    public int RetryCount { get; private set; }
    public int MaxRetries { get; private set; }
    public string? ErrorMessage { get; private set; }
    public string? Checksum { get; private set; }
    public Guid? DuplicateOfAssetId { get; private set; }
    public DateTime? StartedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public DateTime? LastAttemptAt { get; private set; }
    public Guid? ActorId { get; private set; }
    public Guid? TenantId { get; private set; }

    public Dictionary<string, string> ExtractedMetadata { get; private set; } = new();
    public List<Rendition> Renditions { get; private set; } = new();

    public MediaType MediaType => MediaType.FromName(MediaTypeValue);

    private AssetProcessingJob()
    {
    }

    public AssetProcessingJob(
        Guid assetId,
        string storageKey,
        string fileName,
        string mimeType,
        MediaType mediaType,
        long fileSize,
        int maxRetries = 3,
        Guid? actorId = null,
        Guid? tenantId = null,
        Dictionary<string, string>? metadata = null)
    {
        Id = Guid.NewGuid();
        AssetId = assetId;
        StorageKey = storageKey;
        FileName = fileName;
        MimeType = mimeType;
        MediaTypeValue = mediaType.Value;
        FileSize = fileSize;
        MaxRetries = maxRetries;
        ActorId = actorId;
        TenantId = tenantId;
        Status = ProcessingStatus.Queued;
        CurrentStep = ProcessingStep.None;
        ExtractedMetadata = metadata ?? new Dictionary<string, string>();
        SetCreationAudit(actorId, DateTime.UtcNow);
    }

    public void MarkRunning()
    {
        if (Status is not (ProcessingStatus.Queued or ProcessingStatus.Failed))
            throw new InvalidProcessingStateException($"Cannot start processing in status '{Status}'.");

        Status = ProcessingStatus.Running;
        StartedAt ??= DateTime.UtcNow;
        LastAttemptAt = DateTime.UtcNow;
        SetUpdateAudit(ActorId, DateTime.UtcNow);
        AddDomainEvent(new AssetProcessingStartedEvent(Id, AssetId));
    }

    public void MarkStep(ProcessingStep step) => CurrentStep = step;

    public void RecordMetadata(IReadOnlyDictionary<string, string> metadata)
    {
        foreach (var kv in metadata)
        {
            ExtractedMetadata[kv.Key] = kv.Value;
        }

        AddDomainEvent(new MetadataExtractedEvent(Id, AssetId, new Dictionary<string, string>(metadata)));
    }

    public void AddRendition(Rendition rendition)
    {
        Renditions.Add(rendition);
        if (Rendition.ThumbnailKinds.Contains(rendition.Kind))
        {
            AddDomainEvent(new ThumbnailGeneratedEvent(Id, AssetId, rendition.StorageKey, rendition.Format, rendition.Width, rendition.Height));
        }
    }

    public void SetChecksum(string checksum) => Checksum = checksum;

    public void MarkDuplicate(Guid duplicateOfAssetId) => DuplicateOfAssetId = duplicateOfAssetId;

    public void MarkSucceeded()
    {
        Status = ProcessingStatus.Succeeded;
        CurrentStep = ProcessingStep.Ready;
        CompletedAt = DateTime.UtcNow;
        SetUpdateAudit(ActorId, DateTime.UtcNow);
        AddDomainEvent(new AssetProcessedEvent(Id, AssetId, new Dictionary<string, string>(ExtractedMetadata)));
        AddDomainEvent(new AssetReadyEvent(Id, AssetId));
    }

    public void MarkFailed(string errorMessage)
    {
        Status = ProcessingStatus.Failed;
        ErrorMessage = errorMessage;
        LastAttemptAt = DateTime.UtcNow;
        SetUpdateAudit(ActorId, DateTime.UtcNow);
        AddDomainEvent(new ProcessingFailedEvent(Id, AssetId, errorMessage));
    }

    public void MarkRetrying()
    {
        RetryCount++;
        Status = ProcessingStatus.Queued;
        CurrentStep = ProcessingStep.None;
        LastAttemptAt = DateTime.UtcNow;
        AddDomainEvent(new AssetProcessingRetriedEvent(Id, AssetId, RetryCount));
    }

    public void MarkDeadLettered(string errorMessage)
    {
        Status = ProcessingStatus.DeadLettered;
        ErrorMessage = errorMessage;
        LastAttemptAt = DateTime.UtcNow;
        AddDomainEvent(new ProcessingFailedEvent(Id, AssetId, errorMessage));
    }

    public void MarkCancelled()
    {
        Status = ProcessingStatus.Cancelled;
        LastAttemptAt = DateTime.UtcNow;
        SetUpdateAudit(ActorId, DateTime.UtcNow);
    }

    public bool CanRetry => Status == ProcessingStatus.Failed && RetryCount < MaxRetries;
}
