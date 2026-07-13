using MediatR;
using Sathus.Processing.Application.DTOs;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain.Enums;

namespace Sathus.Processing.Application.Queries.GetProcessingHealth;

public sealed class GetProcessingHealthQueryHandler
    : IRequestHandler<GetProcessingHealthQuery, ProcessingHealthResponse>
{
    private readonly IProcessingJobRepository _repository;
    private readonly IProcessingJobQueue _queue;

    public GetProcessingHealthQueryHandler(IProcessingJobRepository repository, IProcessingJobQueue queue)
    {
        _repository = repository;
        _queue = queue;
    }

    public async Task<ProcessingHealthResponse> Handle(GetProcessingHealthQuery request, CancellationToken cancellationToken)
    {
        var queued = await _repository.CountByStatusAsync(ProcessingStatus.Queued, cancellationToken);
        var running = await _repository.CountByStatusAsync(ProcessingStatus.Running, cancellationToken);
        var succeeded = await _repository.CountByStatusAsync(ProcessingStatus.Succeeded, cancellationToken);
        var failed = await _repository.CountByStatusAsync(ProcessingStatus.Failed, cancellationToken);
        var deadLettered = await _repository.CountByStatusAsync(ProcessingStatus.DeadLettered, cancellationToken);
        var total = queued + running + succeeded + failed + deadLettered;

        var queueHealthy = await _queue.IsHealthyAsync(cancellationToken);

        return new ProcessingHealthResponse(queued, running, succeeded, failed, deadLettered, total, queueHealthy);
    }
}
