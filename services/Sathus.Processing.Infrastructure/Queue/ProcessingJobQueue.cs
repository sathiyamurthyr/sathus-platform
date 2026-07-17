using System.Collections.Concurrent;
using System.Threading.Channels;
using Sathus.Processing.Application.Interfaces;

namespace Sathus.Processing.Infrastructure.Queue;

/// <summary>
/// Channel-based, in-process queue of pending processing job identifiers. Backed by an
/// unbounded channel; pending/active counters are tracked atomically for observability.
/// A durable out-of-process queue (e.g. Redis/RabbitMQ) can replace this without
/// changing the <see cref="IProcessingJobQueue"/> contract.
/// </summary>
public sealed class ProcessingJobQueue : IProcessingJobQueue, IDisposable
{
    private readonly Channel<Guid> _channel;
    private int _pending;
    private int _active;
    private bool _disposed;

    public ProcessingJobQueue()
    {
        _channel = Channel.CreateUnbounded<Guid>(new UnboundedChannelOptions
        {
            SingleReader = false,
            SingleWriter = false
        });
    }

    public int PendingCount => Volatile.Read(ref _pending);

    public int ActiveCount => Volatile.Read(ref _active);

    public async Task EnqueueAsync(Guid jobId, CancellationToken cancellationToken = default)
    {
        Interlocked.Increment(ref _pending);
        await _channel.Writer.WriteAsync(jobId, cancellationToken);
    }

    public async Task<Guid?> TryDequeueAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var jobId = await _channel.Reader.ReadAsync(cancellationToken);
            Interlocked.Decrement(ref _pending);
            Interlocked.Increment(ref _active);
            return jobId;
        }
        catch (ChannelClosedException)
        {
            return null;
        }
    }

    public Task ReleaseAsync(CancellationToken cancellationToken = default)
    {
        Interlocked.Decrement(ref _active);
        return Task.CompletedTask;
    }

    public Task<bool> IsHealthyAsync(CancellationToken cancellationToken = default) => Task.FromResult(!_disposed);

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _disposed = true;
        _channel.Writer.TryComplete();
    }
}
