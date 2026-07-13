using System.Threading.Channels;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain.Entities;
using Sathus.Processing.Domain.Enums;

namespace Sathus.Processing.Infrastructure.HostedServices;

/// <summary>
/// Background worker that consumes the processing job queue and runs the pipeline for
/// each job. Implements retry (re-enqueue up to <see cref="AssetProcessingJob.MaxRetries"/>)
/// and dead-lettering when retries are exhausted, plus cooperative cancellation.
/// </summary>
public sealed class ProcessingBackgroundService : BackgroundService
{
    private readonly IProcessingJobQueue _queue;
    private readonly IProcessingJobRepository _repository;
    private readonly IAssetProcessingPipeline _pipeline;
    private readonly ILogger<ProcessingBackgroundService> _logger;

    public ProcessingBackgroundService(
        IProcessingJobQueue queue,
        IProcessingJobRepository repository,
        IAssetProcessingPipeline pipeline,
        ILogger<ProcessingBackgroundService> logger)
    {
        _queue = queue;
        _repository = repository;
        _pipeline = pipeline;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Processing background service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            Guid? jobId;
            try
            {
                jobId = await _queue.TryDequeueAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (ChannelClosedException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to dequeue processing job.");
                await Task.Delay(250, stoppingToken);
                continue;
            }

            if (jobId is null)
            {
                await Task.Delay(250, stoppingToken);
                continue;
            }

            try
            {
                await ProcessJobAsync(jobId.Value, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled error while processing job {JobId}.", jobId.Value);
            }
            finally
            {
                await _queue.ReleaseAsync(stoppingToken);
            }
        }

        _logger.LogInformation("Processing background service stopped.");
    }

    private async Task ProcessJobAsync(Guid jobId, CancellationToken cancellationToken)
    {
        var job = await _repository.GetByIdAsync(jobId, cancellationToken);
        if (job is null)
        {
            _logger.LogWarning("Processing job {JobId} not found.", jobId);
            return;
        }

        if (job.Status != ProcessingStatus.Queued)
        {
            return;
        }

        var result = await _pipeline.ExecuteAsync(job, cancellationToken);

        if (result.Succeeded)
        {
            return;
        }

        var reloaded = await _repository.GetByIdAsync(jobId, cancellationToken);
        if (reloaded is null)
        {
            return;
        }

        if (reloaded.CanRetry)
        {
            reloaded.MarkRetrying();
            await _repository.UpdateAsync(reloaded, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);
            await _queue.EnqueueAsync(reloaded.Id, cancellationToken);
            _logger.LogWarning("Processing job {JobId} scheduled for retry (attempt {Attempt}).", jobId, reloaded.RetryCount);
        }
        else
        {
            reloaded.MarkDeadLettered(reloaded.ErrorMessage ?? "Processing failed.");
            await _repository.UpdateAsync(reloaded, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);
            _logger.LogError("Processing job {JobId} dead-lettered after {Attempts} attempts.", jobId, reloaded.RetryCount);
        }
    }
}
