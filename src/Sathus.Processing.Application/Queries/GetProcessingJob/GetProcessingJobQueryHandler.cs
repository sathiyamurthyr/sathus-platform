using MediatR;
using Sathus.Processing.Application.DTOs;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain.Exceptions;

namespace Sathus.Processing.Application.Queries.GetProcessingJob;

public sealed class GetProcessingJobQueryHandler
    : IRequestHandler<GetProcessingJobQuery, AssetProcessingJobResponse>
{
    private readonly IProcessingJobRepository _repository;

    public GetProcessingJobQueryHandler(IProcessingJobRepository repository)
    {
        _repository = repository;
    }

    public async Task<AssetProcessingJobResponse> Handle(GetProcessingJobQuery request, CancellationToken cancellationToken)
    {
        var job = await _repository.GetByIdAsync(request.JobId, cancellationToken)
            ?? throw new ProcessingJobNotFoundException(request.JobId);

        return job.ToResponse();
    }
}
