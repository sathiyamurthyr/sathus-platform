using MediatR;
using Sathus.SharedKernel.Paging;
using Sathus.Processing.Application.DTOs;
using Sathus.Processing.Application.Interfaces;

namespace Sathus.Processing.Application.Queries.GetProcessingJobs;

public sealed class GetProcessingJobsQueryHandler
    : IRequestHandler<GetProcessingJobsQuery, PagedResult<AssetProcessingJobSummaryResponse>>
{
    private readonly IProcessingJobRepository _repository;

    public GetProcessingJobsQueryHandler(IProcessingJobRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<AssetProcessingJobSummaryResponse>> Handle(GetProcessingJobsQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize is < 1 or > 100 ? 20 : request.PageSize;

        var status = TryParseStatus(request.Status);
        var items = await _repository.GetJobsAsync(status, request.MediaType, page, pageSize, cancellationToken);
        var total = await _repository.CountJobsAsync(status, request.MediaType, cancellationToken);

        return new PagedResult<AssetProcessingJobSummaryResponse>(
            items.Select(j => j.ToSummary()).ToList(), page, pageSize, total);
    }

    private static Sathus.Processing.Domain.Enums.ProcessingStatus? TryParseStatus(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return Enum.TryParse<Sathus.Processing.Domain.Enums.ProcessingStatus>(value, ignoreCase: true, out var result)
            ? result
            : null;
    }
}
