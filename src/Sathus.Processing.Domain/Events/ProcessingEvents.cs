using MediatR;
using Sathus.SharedKernel.Events;

namespace Sathus.Processing.Domain.Events;

public sealed class AssetProcessingStartedEvent : DomainEvent
{
    public Guid JobId { get; }
    public Guid AssetId { get; }
    public AssetProcessingStartedEvent(Guid jobId, Guid assetId)
    {
        JobId = jobId;
        AssetId = assetId;
    }
}

public sealed class AssetProcessedEvent : DomainEvent
{
    public Guid JobId { get; }
    public Guid AssetId { get; }
    public IReadOnlyDictionary<string, string> Metadata { get; }
    public AssetProcessedEvent(Guid jobId, Guid assetId, IReadOnlyDictionary<string, string> metadata)
    {
        JobId = jobId;
        AssetId = assetId;
        Metadata = metadata;
    }
}

public sealed class ThumbnailGeneratedEvent : DomainEvent
{
    public Guid JobId { get; }
    public Guid AssetId { get; }
    public string StorageKey { get; }
    public string Format { get; }
    public int? Width { get; }
    public int? Height { get; }
    public ThumbnailGeneratedEvent(Guid jobId, Guid assetId, string storageKey, string format, int? width, int? height)
    {
        JobId = jobId;
        AssetId = assetId;
        StorageKey = storageKey;
        Format = format;
        Width = width;
        Height = height;
    }
}

public sealed class MetadataExtractedEvent : DomainEvent
{
    public Guid JobId { get; }
    public Guid AssetId { get; }
    public IReadOnlyDictionary<string, string> Metadata { get; }
    public MetadataExtractedEvent(Guid jobId, Guid assetId, IReadOnlyDictionary<string, string> metadata)
    {
        JobId = jobId;
        AssetId = assetId;
        Metadata = metadata;
    }
}

public sealed class AssetReadyEvent : DomainEvent
{
    public Guid JobId { get; }
    public Guid AssetId { get; }
    public AssetReadyEvent(Guid jobId, Guid assetId)
    {
        JobId = jobId;
        AssetId = assetId;
    }
}

public sealed class ProcessingFailedEvent : DomainEvent
{
    public Guid JobId { get; }
    public Guid AssetId { get; }
    public string? ErrorMessage { get; }
    public ProcessingFailedEvent(Guid jobId, Guid assetId, string? errorMessage = null)
    {
        JobId = jobId;
        AssetId = assetId;
        ErrorMessage = errorMessage;
    }
}

public sealed class AssetProcessingRetriedEvent : DomainEvent
{
    public Guid JobId { get; }
    public Guid AssetId { get; }
    public int Attempt { get; }
    public AssetProcessingRetriedEvent(Guid jobId, Guid assetId, int attempt)
    {
        JobId = jobId;
        AssetId = assetId;
        Attempt = attempt;
    }
}
