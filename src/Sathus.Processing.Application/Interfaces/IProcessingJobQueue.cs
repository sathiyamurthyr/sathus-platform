namespace Sathus.Processing.Application.Interfaces;

/// <summary>
/// In-memory/durable queue of pending processing job identifiers consumed by the
/// background worker. Implemented in the infrastructure layer (channel-based).
/// </summary>
public interface IProcessingJobQueue
{
    Task EnqueueAsync(Guid jobId, CancellationToken cancellationToken = default);

    Task<Guid?> TryDequeueAsync(CancellationToken cancellationToken = default);

    Task ReleaseAsync(CancellationToken cancellationToken = default);

    Task<bool> IsHealthyAsync(CancellationToken cancellationToken = default);

    int PendingCount { get; }

    int ActiveCount { get; }
}
