using Sathus.SharedKernel.Entities;

namespace Sathus.Upload.Domain.Entities;

public sealed class UploadChunk : Entity
{
    public Guid SessionId { get; private set; }
    public UploadSession Session { get; private set; } = null!;
    public int ChunkIndex { get; private set; }
    public long Size { get; private set; }
    public long Offset { get; private set; }
    public string? Checksum { get; private set; }
    public ChunkStatus Status { get; private set; }
    public int RetryCount { get; private set; }
    public DateTime? StartedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public string? StorageKey { get; private set; }

    private UploadChunk()
    {
    }

    public UploadChunk(Guid sessionId, int chunkIndex, long size, long offset, string? checksum = null)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(chunkIndex, 0);
        ArgumentOutOfRangeException.ThrowIfLessThan(size, 0);
        ArgumentOutOfRangeException.ThrowIfLessThan(offset, 0);

        Id = Guid.NewGuid();
        SessionId = sessionId;
        ChunkIndex = chunkIndex;
        Size = size;
        Offset = offset;
        Checksum = checksum;
        Status = ChunkStatus.Pending;
        RetryCount = 0;
    }

    public void MarkUploading(Guid? updatedBy = null)
    {
        Status = ChunkStatus.Uploading;
        StartedAt = DateTime.UtcNow;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void MarkCompleted(string? storageKey = null, Guid? updatedBy = null)
    {
        Status = ChunkStatus.Completed;
        CompletedAt = DateTime.UtcNow;
        StorageKey = storageKey;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void MarkFailed(Guid? updatedBy = null)
    {
        Status = ChunkStatus.Failed;
        RetryCount++;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void MarkSkipped(Guid? updatedBy = null)
    {
        Status = ChunkStatus.Skipped;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }
}
