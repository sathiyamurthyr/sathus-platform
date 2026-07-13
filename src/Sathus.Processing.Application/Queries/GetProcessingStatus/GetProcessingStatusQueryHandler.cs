using System.Linq;
using MediatR;
using Sathus.Processing.Application.DTOs;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain.Exceptions;

namespace Sathus.Processing.Application.Queries.GetProcessingStatus;

public sealed class GetProcessingStatusQueryHandler
    : IRequestHandler<GetProcessingStatusQuery, AssetProcessingStatusResponse>
{
    private readonly IProcessingJobRepository _repository;

    public GetProcessingStatusQueryHandler(IProcessingJobRepository repository)
    {
        _repository = repository;
    }

    public async Task<AssetProcessingStatusResponse> Handle(GetProcessingStatusQuery request, CancellationToken cancellationToken)
    {
        var jobs = await _repository.GetAsync(
            new AssetProcessingJobSpecifications.ByAsset(request.AssetId), cancellationToken);

        var job = jobs.OrderByDescending(j => j.CreatedAt).FirstOrDefault()
            ?? throw new ProcessingJobNotFoundException(request.AssetId);

        return job.ToStatus();
    }
}
