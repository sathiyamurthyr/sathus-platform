using System.Collections.ObjectModel;
using MediatR;
using Sathus.SharedKernel.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Domain.Events;

namespace Sathus.Upload.Domain.Entities;

public sealed class UploadSession : AggregateRoot
{
    public string SessionId { get; private set; } = string.Empty;
    public global::Sathus.Media.Domain.ValueObjects.FileName FileName { get; private set; } = null!;
    public global::Sathus.Media.Domain.ValueObjects.FileExtension FileExtension { get; private set; } = null!;
    public global::Sathus.Media.Domain.ValueObjects.MimeType MimeType { get; private set; } = null!;
    public global::Sathus.Media.Domain.ValueObjects.FileSize FileSize { get; private set; } = null!;
    public global::Sathus.Media.Domain.ValueObjects.StorageKey? StorageKey { get; private set; }
    public global::Sathus.Media.Domain.ValueObjects.Checksum? Checksum { get; private set; }
    public long ChunkSize { get; private set; }
    public int TotalChunks { get; private set; }
    public int UploadedChunks { get; private set; }
    public double Progress { get; private set; }
    public UploadStatus Status { get; private set; }
    public string? ErrorMessage { get; private set; }
    public DateTime StartedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public Guid? ActorId { get; private set; }
    public Guid? TenantId { get; private set; }
    public Guid? FolderId { get; private set; }
    public Guid? ParentSessionId { get; private set; }
    public bool IsFolder { get; private set; }
    public string? FolderPath { get; private set; }
    public Dictionary<string, string> Metadata { get; } = new();

    public ICollection<UploadChunk> Chunks { get; } = new List<UploadChunk>();
    public ICollection<UploadSession> ChildSessions { get; } = new List<UploadSession>();

    private UploadSession()
    {
    }

    public UploadSession(
        string sessionId,
        global::Sathus.Media.Domain.ValueObjects.FileName fileName,
        global::Sathus.Media.Domain.ValueObjects.FileExtension fileExtension,
        global::Sathus.Media.Domain.ValueObjects.MimeType mimeType,
        global::Sathus.Media.Domain.ValueObjects.FileSize fileSize,
        long chunkSize,
        Guid? createdBy = null,
        Guid? tenantId = null,
        Guid? folderId = null,
        Guid? parentSessionId = null,
        bool isFolder = false,
        string? folderPath = null,
        Dictionary<string, string>? metadata = null)
    {
        Id = Guid.NewGuid();
        SessionId = sessionId;
        FileName = fileName;
        FileExtension = fileExtension;
        MimeType = mimeType;
        FileSize = fileSize;
        ChunkSize = chunkSize;
        ActorId = createdBy;
        TenantId = tenantId;
        FolderId = folderId;
        ParentSessionId = parentSessionId;
        IsFolder = isFolder;
        FolderPath = folderPath;
        Metadata = metadata ?? new();
        Status = UploadStatus.Pending;
        StartedAt = DateTime.UtcNow;
        Progress = 0;
        UploadedChunks = 0;
        TotalChunks = CalculateTotalChunks(fileSize.Bytes, chunkSize);
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }

    private static int CalculateTotalChunks(long fileSize, long chunkSize)
    {
        if (chunkSize <= 0) return 1;
        return (int)Math.Ceiling((double)fileSize / chunkSize);
    }

    public void InitializeChunks()
    {
        Chunks.Clear();
        var offset = 0L;
        for (var i = 0; i < TotalChunks; i++)
        {
            var size = Math.Min(ChunkSize, FileSize.Bytes - offset);
            Chunks.Add(new UploadChunk(Id, i, size, offset));
            offset += size;
        }
    }

    public void Start(Guid? updatedBy = null)
    {
        if (Status != UploadStatus.Pending && Status != UploadStatus.Failed && Status != UploadStatus.Cancelled)
            throw new InvalidOperationException($"Cannot start upload in status '{Status}'.");

        Status = UploadStatus.Uploading;
        StartedAt = DateTime.UtcNow;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new UploadStartedEvent(Id));
    }

    public void UpdateProgress(int uploadedChunks, string? errorMessage = null)
    {
        UploadedChunks = uploadedChunks;
        Progress = TotalChunks > 0 ? (double)UploadedChunks / TotalChunks * 100 : 0;
        ErrorMessage = errorMessage;

        if (UploadedChunks == TotalChunks && TotalChunks > 0)
        {
            Complete(null);
        }
        else
        {
            AddDomainEvent(new UploadProgressUpdatedEvent(Id, Progress));
        }
    }

    public void Complete(string? storageKey, Guid? updatedBy = null)
    {
        Status = UploadStatus.Completed;
        CompletedAt = DateTime.UtcNow;
        StorageKey = string.IsNullOrWhiteSpace(storageKey)
            ? StorageKey
            : global::Sathus.Media.Domain.ValueObjects.StorageKey.Create(storageKey);
        if (StorageKey is null)
            StorageKey = global::Sathus.Media.Domain.ValueObjects.StorageKey.Create($"uploads/{SessionId}/{FileName.Value}");
        Progress = 100;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new UploadCompletedEvent(Id));
    }

    public void Fail(string errorMessage, Guid? updatedBy = null)
    {
        Status = UploadStatus.Failed;
        ErrorMessage = errorMessage;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new UploadFailedEvent(Id, errorMessage));
    }

    public void Cancel(Guid? updatedBy = null)
    {
        if (Status == UploadStatus.Completed)
            throw new InvalidOperationException("Cannot cancel a completed upload.");

        Status = UploadStatus.Cancelled;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new UploadCancelledEvent(Id));
    }

    public void Pause(Guid? updatedBy = null)
    {
        if (Status != UploadStatus.Uploading)
            throw new InvalidOperationException("Only active uploads can be paused.");

        Status = UploadStatus.Paused;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void Resume(Guid? updatedBy = null)
    {
        if (Status != UploadStatus.Paused)
            throw new InvalidOperationException("Only paused uploads can be resumed.");

        Status = UploadStatus.Uploading;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new UploadResumedEvent(Id));
    }

    public void MarkChunkCompleted(int chunkIndex, string? storageKey = null, Guid? updatedBy = null)
    {
        var chunk = Chunks.FirstOrDefault(c => c.ChunkIndex == chunkIndex)
            ?? throw new ArgumentException($"Chunk {chunkIndex} not found.", nameof(chunkIndex));

        chunk.MarkCompleted(storageKey, updatedBy);
        UploadedChunks = Chunks.Count(c => c.Status == ChunkStatus.Completed);
        Progress = TotalChunks > 0 ? (double)UploadedChunks / TotalChunks * 100 : 0;

        if (UploadedChunks == TotalChunks && TotalChunks > 0)
        {
            Complete(null, updatedBy);
        }
        else
        {
            AddDomainEvent(new UploadProgressUpdatedEvent(Id, Progress));
        }
    }

    public void MarkChunkFailed(int chunkIndex, Guid? updatedBy = null)
    {
        var chunk = Chunks.FirstOrDefault(c => c.ChunkIndex == chunkIndex)
            ?? throw new ArgumentException($"Chunk {chunkIndex} not found.", nameof(chunkIndex));

        chunk.MarkFailed(updatedBy);
        AddDomainEvent(new ChunkFailedEvent(Id, chunkIndex));
    }

    public IReadOnlyList<int> GetMissingChunkIndices()
    {
        return Chunks
            .Where(c => c.Status != ChunkStatus.Completed && c.Status != ChunkStatus.Skipped)
            .Select(c => c.ChunkIndex)
            .OrderBy(i => i)
            .ToList()
            .AsReadOnly();
    }
}
