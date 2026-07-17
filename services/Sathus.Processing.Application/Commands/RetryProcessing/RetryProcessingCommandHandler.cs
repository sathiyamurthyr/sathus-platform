using MediatR;
using Sathus.Processing.Application.DTOs;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain.Enums;
using Sathus.Processing.Domain.Exceptions;

namespace Sathus.Processing.Application.Commands.RetryProcessing;

public sealed class RetryProcessingCommandHandler
    : IRequestHandler<RetryProcessingCommand, RetryProcessingResponse>
{
    private readonly IProcessingJobRepository _repository;
    private readonly IProcessingJobQueue _queue;

    public RetryProcessingCommandHandler(IProcessingJobRepository repository, IProcessingJobQueue queue)
    {
        _repository = repository;
        _queue = queue;
    }

    public async Task<RetryProcessingResponse> Handle(RetryProcessingCommand request, CancellationToken cancellationToken)
    {
        var job = await _repository.GetByAssetIdAsync(request.AssetId, cancellationToken)
            ?? throw new ProcessingJobNotFoundException(request.AssetId);

        if (job.Status is not (ProcessingStatus.Failed or ProcessingStatus.DeadLettered))
        {
            throw new InvalidProcessingStateException(
                $"Job for asset '{request.AssetId}' cannot be retried in status '{job.Status}'.");
        }

        job.MarkRetrying();
        await _repository.UpdateAsync(job, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        await _queue.EnqueueAsync(job.Id, cancellationToken);

        return new RetryProcessingResponse(job.Id, job.Status.ToString(), job.RetryCount);
    }
}
