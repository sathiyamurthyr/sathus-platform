using MediatR;
using Sathus.SharedKernel.Events;

namespace Sathus.Upload.Domain.Events;

public sealed class UploadStartedEvent : DomainEvent
{
    public Guid SessionId { get; }
    public UploadStartedEvent(Guid sessionId) => SessionId = sessionId;
}

public sealed class UploadProgressUpdatedEvent : DomainEvent
{
    public Guid SessionId { get; }
    public double Progress { get; }
    public UploadProgressUpdatedEvent(Guid sessionId, double progress)
    {
        SessionId = sessionId;
        Progress = progress;
    }
}

public sealed class UploadCompletedEvent : DomainEvent
{
    public Guid SessionId { get; }
    public UploadCompletedEvent(Guid sessionId) => SessionId = sessionId;
}

public sealed class UploadFailedEvent : DomainEvent
{
    public Guid SessionId { get; }
    public string? ErrorMessage { get; }
    public UploadFailedEvent(Guid sessionId, string? errorMessage = null)
    {
        SessionId = sessionId;
        ErrorMessage = errorMessage;
    }
}

public sealed class UploadCancelledEvent : DomainEvent
{
    public Guid SessionId { get; }
    public UploadCancelledEvent(Guid sessionId) => SessionId = sessionId;
}

public sealed class UploadResumedEvent : DomainEvent
{
    public Guid SessionId { get; }
    public UploadResumedEvent(Guid sessionId) => SessionId = sessionId;
}

public sealed class ChunkUploadedEvent : DomainEvent
{
    public Guid SessionId { get; }
    public int ChunkIndex { get; }
    public ChunkUploadedEvent(Guid sessionId, int chunkIndex)
    {
        SessionId = sessionId;
        ChunkIndex = chunkIndex;
    }
}

public sealed class ChunkFailedEvent : DomainEvent
{
    public Guid SessionId { get; }
    public int ChunkIndex { get; }
    public ChunkFailedEvent(Guid sessionId, int chunkIndex)
    {
        SessionId = sessionId;
        ChunkIndex = chunkIndex;
    }
}

public sealed class AssetCreatedFromUploadEvent : DomainEvent
{
    public Guid SessionId { get; }
    public string StorageKey { get; }
    public AssetCreatedFromUploadEvent(Guid sessionId, string storageKey)
    {
        SessionId = sessionId;
        StorageKey = storageKey;
    }
}

public sealed class UploadAuditedEvent : DomainEvent
{
    public Guid SessionId { get; }
    public string StorageKey { get; }
    public IReadOnlyDictionary<string, string> ExtractedMetadata { get; }
    public UploadAuditedEvent(Guid sessionId, string storageKey, IReadOnlyDictionary<string, string> extractedMetadata)
    {
        SessionId = sessionId;
        StorageKey = storageKey;
        ExtractedMetadata = extractedMetadata;
    }
}
