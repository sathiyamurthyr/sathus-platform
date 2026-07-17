namespace Sathus.Processing.Domain.Enums;

/// <summary>
/// Lifecycle state of an asynchronous asset processing job.
/// </summary>
public enum ProcessingStatus
{
    Queued = 0,
    Running = 1,
    Succeeded = 2,
    Failed = 3,
    DeadLettered = 4,
    Cancelled = 5
}
