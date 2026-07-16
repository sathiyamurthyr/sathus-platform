using MediatR;
using Sathus.SharedKernel.Paging;
using Sathus.Processing.Application.DTOs;

namespace Sathus.Processing.Application.Queries.GetProcessingJobs;

public sealed record GetProcessingJobsQuery(
    string? Status = null,
    string? MediaType = null,
    int Page = 1,
    int PageSize = 20)
    : IRequest<PagedResult<AssetProcessingJobSummaryResponse>>;
